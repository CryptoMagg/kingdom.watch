<template>

  <div class="row">
    <div class="col-lg-8 p-2 w-100">
      <div class="border border-dark rounded-3">
        <h3 class="p-3">{{ poolName }}</h3>
        <p v-if="userUnstaked > 0" class="text-danger">You have unstaked LP tokens for this pool</p>
        <table class="m-auto table table-hover w-100">
          <tbody>
          <tr>
            <td class="text-start">Garden Share</td>
            <td></td>
            <td class="text-end">{{ (userShare * 100).toFixed(4) }}%</td>
            <td class="text-end">{{ formatNumber(usdShareValue,'$') }}</td>
          </tr>
          <tr>
            <td class="text-start">{{ token0.symbol }}</td>
            <td></td>
            <td class="text-end">{{ formatNumber(token0["userBalance"]) }}</td>
            <td class="text-end"></td>
          </tr>
          <tr>
            <td class="text-start">{{ token1.symbol }}</td>
            <td></td>
            <td class="text-end">{{ formatNumber(token1["userBalance"]) }}</td>
            <td class="text-end"></td>
          </tr>
          <tr>
            <td class="text-start">Pending locked</td>
            <td></td>
            <td class="text-end">{{ formatNumber(pendingLocked) }}</td>
            <td class="text-end">{{ formatNumber(pendingLocked * this.prices()["JEWEL"],'$') }}</td>
          </tr>
          <tr>
            <td class="text-start">Pending unlocked</td>
            <td></td>
            <td class="text-end">{{ formatNumber(pendingUnlocked) }}</td>
            <td class="text-end">{{ formatNumber(pendingUnlocked * this.prices()["JEWEL"],'$') }}</td>
          </tr>
          <tr>
            <td class="text-start">Current withdrawal fee</td>
            <td class="text-end"></td>
            <td class="text-end">{{ currentWithdrawalFee }}%</td>
            <td class="text-end">{{ formatNumber(currentWithdrawalFee * usdShareValue / 100,'$') }}</td>
          </tr>
          <tr>
            <td colspan="2" class="text-start">Next withdrawal fee tier</td>
            <td class="text-end">{{ nextBetterFee }}%</td>
            <td class="text-end">{{ formatNumber(usdShareValue * nextBetterFee / 100,'$') }}</td>
          </tr>
          <tr>
            <td colspan="3" class="text-start">USD saved if waiting {{ timeBeforeNextFeeLevel }}</td>
            <td class="text-end">{{ formatNumber(usdSavedBetterFee,'$') }}</td>
          </tr>
          <PersonalAPR />
          </tbody>
        </table>
        <div v-if="progress/maxProgress < 1" class="progress">
          <div
              class="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              aria-valuenow="0"
              aria-valuemin="0"
              :aria-valuemax="maxProgress"
              :style="{width: (progress/maxProgress * 100) + '%'}">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalAPR from "@/components/personal/PersonalAPR";
const formatNumber = require('../../utils/FormatNumber')
import timeString from '../../utils/TimeString'
import withdrawalFee from '../../data/WithdrawalFees'

import { Contract } from 'ethers'
import { contractJson, contracts, RPCs } from "@/utils/ethers";

export default {
  name: "PersonalGarden",
  components: {PersonalAPR},
  props: ["poolId", "userInfo", "userAddress", "expansion"],
  data() {
    return {
      poolInfo: {},
      progress: 0,
      maxProgress: 10,
      token0: {},
      token0availableInPool: 0,
      token1: {},
      token1availableInPool: 0,
      pendingRewards: 0,
      userShare: 0.0,
      userUnstaked: 0,
      betterWithdrawalFee: 0
    }
  },
  methods: {
    formatNumber(num, prefix, suffix) {
      return formatNumber(num, prefix, suffix)
    },
    calcUsdShareValue() {
      if (this.prices()[this.token0.symbol])
        return this.prices()[this.token0.symbol] * this.token0["userBalance"] * 2
      else if (this.prices()[this.token1.symbol])
        return this.prices()[this.token1.symbol] * this.token1["userBalance"] * 2
      else
        return 0.0
    },
    async loadGarden() {
      const gardener = contracts[this.expansion].gardener
      this.poolInfo = await gardener.poolInfo(this.poolId)
      this.progress++
      const contract = new Contract(this.poolInfo.lpToken, contractJson.uni.abi, RPCs[this.expansion])
      await Promise.all([
        contract.token0()
            .then(tokenAddress => {
              this.progress++
              return this.getErc20Token(tokenAddress)
                  .then(token => {
                    this.token0 = token
                    this.progress++
                  })
            }),
        contract.token1()
            .then(tokenAddress => {
              this.progress++
              return this.getErc20Token(tokenAddress)
                  .then(token => {
                    this.token1 = token
                    this.progress++
                  })
            }),
        contract.totalSupply()
            .then(totalSupply => {
              this.progress++
              return contract.balanceOf(gardener.address)
                  .then(balance => {
                    this.progress++
                    this.userShare = this.userInfo.amount / balance
                    return contract.getReserves()
                        .then(reserves => {
                          this.progress++
                          const ratioStaked = balance / totalSupply
                          this.token0availableInPool = reserves._reserve0 * ratioStaked
                          this.token1availableInPool = reserves._reserve1 * ratioStaked
                        })
                  })
            }),
        contract.balanceOf(this.userAddress)
            .then(unstaked => {
              this.progress++
              this.userUnstaked = unstaked / 1e18
            })
            .catch(err => {
              console.log(err)
            }),
        gardener.pendingReward(this.poolId, this.userAddress)
            .then(pending => {
              this.progress++
              this.pendingRewards = pending / 1e18
            })
            .catch(err => {
              console.log(err)
            })
      ])
      this.token0["userBalance"] = (this.token0availableInPool / 10 ** this.token0["decimals"]) * this.userShare
      this.token1["userBalance"] = (this.token1availableInPool / 10 ** this.token1["decimals"]) * this.userShare
      this.poolDone({
        poolId: this.poolId,
        poolName: this.poolName,
        pendingRewards: this.pendingRewards,
        usdValue: this.calcUsdShareValue(),
        apr: this.calcApr,
        allocPoints: this.poolInfo.allocPoint,
        userShare: this.userShare,
        userUnstaked: this.userUnstaked
      }, this.expansion)
    },
    async getErc20Token(tokenAddress) {
      const contract = new Contract(tokenAddress, contractJson.erc20.abi, RPCs[this.expansion])
      const tokenInfo = {
        name: await contract.name(),
        symbol: await contract.symbol(),
        decimals: await contract.decimals()
      }
      return tokenInfo
    },
    calcApr() {
      if (this.userRewardsPerDay === 0 || this.prices()["JEWEL"] === 0)
        return 0
      const usdRewardsPerDay = this.userRewardsPerDay * this.prices()["JEWEL"]
      const usdValue = this.usdShareValue
      if (usdRewardsPerDay === 0 || usdValue === 0)
        return 0
      return usdRewardsPerDay / usdValue * 100
    }
  },
  computed: {
    currentWithdrawalFee() {
      if (this.blockNumber() < 1)
        return 0
      let lastBlock
      if (this.userInfo["lastWithdrawBlock"] < 1)
        lastBlock = this.userInfo["firstDepositBlock"]
      else
        lastBlock = this.userInfo["lastWithdrawBlock"]
      return withdrawalFee.getFee(this.blockNumber() - lastBlock)
    },
    timeBeforeNextFeeLevel() {
      if (this.blockNumber() < 1)
        return ""
      let lastBlock
      if (this.userInfo["lastWithdrawBlock"] < 1)
        lastBlock = this.userInfo["firstDepositBlock"]
      else
        lastBlock = this.userInfo["lastWithdrawBlock"]
      return timeString.timeSpanStringBlocks(
          withdrawalFee.blocksBeforeNextLevel(this.blockNumber() - lastBlock),
          "At lowest tier",
          this.blockTime()
      )
    },
    nextBetterFee() {
      const currentFee = this.currentWithdrawalFee
      if(!currentFee)
        return 0
      return withdrawalFee.nextBetterFee(currentFee)
    },
    usdSavedBetterFee() {
      const currentFee = this.currentWithdrawalFee
      const usdValue = this.usdShareValue
      const nextBetterFee = this.nextBetterFee
      if (!currentFee || !usdValue || !nextBetterFee)
        return 0
      const currentFeeUsd = usdValue * currentFee / 100
      const nextBetterFeeUsd = usdValue * nextBetterFee / 100
      if (nextBetterFeeUsd === currentFeeUsd)
        return 0
      return currentFeeUsd - nextBetterFeeUsd
    },
    usdShareValue() {
      return this.calcUsdShareValue()
    },
    userRewardsPerDay() {
      if (this.poolInfo.allocPoint > 0
          && this.totalAllocPoints() > 0
          && this.totalRewardsPerDay() > 0
          && this.userShare > 0) {
        return this.poolInfo.allocPoint / this.totalAllocPoints() * this.totalRewardsPerDay() * this.userShare
      } else
        return 0
    },
    pendingLocked() {
      if (!this.epoch(this.expansion)) return 0
      return this.pendingRewards * (100 - this.epoch(this.expansion).unlock) / 100
    },
    pendingUnlocked() {
      if (!this.epoch(this.expansion)) return 0
      return this.pendingRewards * this.epoch(this.expansion).unlock / 100
    },
    poolName() {
      if (!!this.token0.symbol && !!this.token1.symbol)
        return `${this.token0.symbol} / ${this.token1.symbol}`
      else
        return ""
    },
    apr() {
      if (this.userRewardsPerDay === 0 || this.prices()["JEWEL"] === 0)
        return 0
      const usdRewardsPerDay = this.userRewardsPerDay * this.prices()["JEWEL"]
      const usdValue = this.usdShareValue
      if (usdRewardsPerDay === 0 || usdValue === 0)
        return 0
      return usdRewardsPerDay / usdValue * 100
    },
  },
  inject: ["totalAllocPoints", "totalRewardsPerDay", "epoch", "poolDone", "prices", "blockNumber", "blockTime"],
  provide() {
    return {
      userRewardsPerDay: () => this.userRewardsPerDay,
      apr: () => this.apr
    }
  },
  mounted() {
    this.loadGarden()
  }
}
</script>

<style scoped>
</style>