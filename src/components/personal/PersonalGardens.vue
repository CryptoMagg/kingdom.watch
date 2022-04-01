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
    <div>
      <PersonalGardenCV :pool-id=0 :user-info="userInfosCV[0]" :user-address="userAddress"/>
    </div>
  </div>
</template>

<script>
import epochs from "@/data/Epochs";
import epochsCV from "@/data/EpochsCV";

const _ = require('lodash')
import {hexToNumber} from "@harmony-js/utils";
import PersonalGarden from "@/components/personal/PersonalGarden"
import PersonalGardenCV from "@/components/personal/PersonalGardenCV"
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

const { ethers } = require("ethers");

// const dfkChain = new ethers.providers.JsonRpcProvider('https://avax-dfk.gateway.pokt.network/v1/lb/6244818c00b9f0003ad1b619//ext/bc/q2aTwKuyzgs8pynF7UXBZCU7DejbZbZ6EUyHr3JQzYgwNPUPi/rpc');
const dfkChain = new ethers.providers.JsonRpcProvider('https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc');
const gardenerCVContractAddress = "0x57Dec9cC7f492d6583c773e2E7ad66dcDc6940Fb"
const gardenerCVContract = new ethers.Contract(gardenerCVContractAddress, gardenerContractJson.abi, dfkChain)

export default {
  name: "PersonalGardens",
  components: {
    PersonalAPR,
    PersonalGarden,
    PersonalGardenCV
  },
  props: ["userAddress"],
  data() {
    return {
      error: "",
      poolCount: 0,
      poolCountCV: 0,
      userInfos: [],
      userPools: [],
      userInfosCV: [],
      userPoolsCV: [],
      totalAllocPoints: 0,
      totalAllocPointsCV: 0,
      totalRewardsPerDay: 0,
      totalRewardsPerDayCV: 0,
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
              console.log(blockNum)
              this.setBlockNumber(blockNum)
              const epoch = epochs.getCurrentEpoch(blockNum)
              this.increaseProgress()

              return gardenerContract.methods.REWARD_PER_BLOCK()
                  .call()
                  .then(result => {
                    const rewardPerBlock = result / 1e18
                    this.totalRewardsPerDay = rewardPerBlock * epoch.multiplier * 86400 / this.blockTime()
                    console.log(this.totalRewardsPerDay)
                    this.increaseProgress()
                  })
            })

        gardenerContract.methods.totalAllocPoint()
            .call()
            .then(totalAllocPoints => {
              this.totalAllocPoints = totalAllocPoints
              console.log(this.totalAllocPointsCV)
              this.increaseProgress()
            })

      } catch (e) {
        this.handleError(e)
      }
    },

    async initCVGardens() {

      try {
        this.poolCountCV = (await gardenerCVContract.poolLength()) * 1
        this.maxProgress += this.poolCount
        this.increaseProgress()

        for (let i = 0; i < this.poolCountCV; i++) {

          const userInfo = await gardenerCVContract.userInfo(i, this.userAddress)
          if (userInfo.amount > 0) {
            this.userInfosCV[i] = userInfo
            this.userPoolsCV.push(i)
          }

          this.increaseProgress()
        }

        this.setPoolCount(this.userPools.length)

        dfkChain.getBlockNumber()
            .then(result => {
              const epochCV = epochsCV.getCurrentEpoch(result)
              const rewardPerBlock = 16
              this.totalRewardsPerDayCV = rewardPerBlock * epochCV.multiplier * 86400 / this.blockTime()
              console.log(this.totalRewardsPerDayCV)
            })

        gardenerCVContract.totalAllocPoint()
            .then(totalAllocPoints => {
            
              this.totalAllocPointsCV = totalAllocPoints
              console.log(totalAllocPoints)
              this.increaseProgress()
            })
      console.log(this.userInfosCV)
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
    this.initCVGardens()
  }
}
</script>

<style scoped>

</style>
