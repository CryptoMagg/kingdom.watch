<template>

  <div>
    <div>
      <p>{{ error }}</p>
    </div>
    <div class="row">
      <div class="col-lg-8 p-2 m-auto">
        <div class="border border-dark rounded-3">
          <h3 class="p-3">Total across all {{ pools().length }} pools</h3>
          <table class="m-auto table table-hover w-100">
            <tbody>
            <PersonalAPR/>
            </tbody>
          </table>
          <div v-if="pools().length < userPools.length" class="progress">
            <div
                class="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                aria-valuenow="0"
                aria-valuemin="0"
                :aria-valuemax="userPools.length"
                :style="{width: (pools().length/userPools.length * 100) + '%'}">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-for="poolId in userPools" :key="poolId">
      <PersonalGarden :pool-id="poolId" :user-info="userInfos[poolId]" :user-address="userAddress"/>
    </div>
  </div>
</template>

<script>
import epochs from "@/data/Epochs";

const _ = require('lodash')
import {hexToNumber} from "@harmony-js/utils";
import PersonalGarden from "@/components/personal/PersonalGarden"
import PersonalAPR from "@/components/personal/PersonalAPR";

const {Harmony} = require('@harmony-js/core');
const {
  ChainID,
  ChainType,
} = require('@harmony-js/utils');

const hmy = new Harmony(
    'https://harmony-0-rpc.gateway.pokt.network', //'https://api.harmony.one',
    {
      chainType: ChainType.Harmony,
      chainId: ChainID.HmyMainnet,
    },
);

const gardenerContractJson = require("../../data/MasterGardener.json")
const gardenerContractAddress = "0xdb30643c71ac9e2122ca0341ed77d09d5f99f924"

const gardenerContract = hmy.contracts.createContract(gardenerContractJson.abi, gardenerContractAddress)


export default {
  name: "PersonalGardens",
  components: {
    PersonalAPR,
    PersonalGarden
  },
  props: ["userAddress"],
  data() {
    return {
      error: "",
      poolCount: 0,
      userInfos: [],
      userPools: [],
      totalAllocPoints: 0,
      totalRewardsPerDay: 0,
      progress: 0,
      maxProgress: 4,
    }
  },
  methods: {
    increaseProgress() {
      this.progress++
      const progressPct = this.progress / this.maxProgress * 100
      this.setCommonProgress(progressPct)
    },
    async initGardens() {

      try {
        this.poolCount = (await gardenerContract.methods.poolLength().call()) * 1
        this.maxProgress += this.poolCount
        this.increaseProgress()

        for (let i = 0; i < this.poolCount; i++) {

          const userInfo = await gardenerContract.methods.userInfo(i, this.userAddress)
              .call()

          if (userInfo.amount > 0) {
            this.userInfos[i] = userInfo
            this.userPools.push(i)
          }

          this.increaseProgress()
        }

        this.setPoolCount(this.userPools.length)

        hmy.blockchain.getBlockNumber()
            .then(result => {
              const blockNum = hexToNumber(result.result)
              this.setBlockNumber(blockNum)
              const epoch = epochs.getCurrentEpoch(blockNum)
              this.increaseProgress()

              return gardenerContract.methods.REWARD_PER_BLOCK()
                  .call()
                  .then(result => {
                    const rewardPerBlock = result / 1e18
                    this.totalRewardsPerDay = rewardPerBlock * epoch.multiplier * 86400 / this.blockTime()
                    this.increaseProgress()
                  })
            })

        gardenerContract.methods.totalAllocPoint()
            .call()
            .then(totalAllocPoints => {
              this.totalAllocPoints = totalAllocPoints
              this.increaseProgress()
            })

      } catch (e) {
        this.handleError(e)
      }
    },

    calcApr() {
      const userRewardsPerDay = this.calcUserRewardsPerDay()
      const jewelPrice = this.prices()["JEWEL"]
      const userUsdTotal = _.sumBy(this.pools(), "usdValue")

      if (userRewardsPerDay === 0 || jewelPrice === 0 || userUsdTotal === 0)
        return 0

      const userUsdPerDay = userRewardsPerDay * jewelPrice

      return userUsdPerDay / userUsdTotal * 100

    },
    calcUserRewardsPerDay() {
      let userRewardsDay = 0
      for (let pool of this.pools()) {
        userRewardsDay += pool.allocPoints / this.totalAllocPoints * this.totalRewardsPerDay * pool.userShare
      }

      return userRewardsDay
    },
    handleError(err) {
      this.error += err
      console.log(err)
    }
  },
  inject: ["setBlockNumber", "blockNumber", "epoch", "setPoolCount", "pools", "prices", "setCommonProgress", "blockTime"],
  provide() {
    return {
      totalAllocPoints: () => this.totalAllocPoints,
      totalRewardsPerDay: () => this.totalRewardsPerDay,
      apr: () => this.calcApr(),
      userRewardsPerDay: () => this.calcUserRewardsPerDay(),
    }
  },
  mounted() {
    this.initGardens()
  }
}
</script>

<style scoped>

</style>
