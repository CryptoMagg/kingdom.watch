<template>
  <div>
    <div>
      <p>{{ error }}</p>
    </div>
    <div class="row">
      <div class="col-lg-8 p-2 m-auto">
        <div class="border border-dark rounded-3">
          <div v-for="[[exp, symbol], expansion] of [[['Serendale', 'Jewel'], 'sd'], [['Crystalvale', 'Crystal'], 'cv']]" :key="symbol">
            <h3 class="p-3">
              {{ pools(expansion).length>0?"Total across":"" }} {{ pools(expansion).length }}
              {{ exp }} pool{{ pools(expansion).length>1||pools(expansion).length===0?"s":""}}
            </h3>
            <table class="m-auto table table-hover w-100">
              <tbody>
              <PersonalAPR :expansion="expansion"/>
              </tbody>
            </table>
            <div v-if="pools(expansion).length < Object.keys(this.userPools[expansion]).length" class="progress">
              <div
                  class="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  aria-valuenow="0"
                  aria-valuemin="0"
                  :aria-valuemax="Object.keys(this.userPools[expansion]).length"
                  :style="{width: (pools(expansion).length/Object.keys(this.userPools[expansion]).length * 100) + '%'}">
              </div>
            </div>
            <div v-for="poolId of userPools[expansion]" :key="poolId" class="shit">
              <PersonalGarden :pool-id="poolId" :user-info="userInfos[expansion][poolId]" :expansion="expansion" :user-address="userAddress"/>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

const _ = require('lodash')

import epochs from "@/data/Epochs";
import PersonalAPR from "@/components/personal/PersonalAPR";
import PersonalGarden from "@/components/personal/PersonalGarden"
import {contracts, RPCs, formatUnits, formatEther} from "@/utils/ethers"

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
      poolCount: {
        sd: 0,
        cv: 0
      },
      userInfos: {
        sd: {},
        cv: {}
      },
      userPools: {
        sd: {},
        cv: {}
      },
      totalAllocPoints: {
        sd: 0,
        cv: 0
      },
      totalRewardsPerDay: {
        sd: 0,
        cv: 0
      },
      progress: {
        sd: 0,
        cv: 0
      },
      maxProgress: {
        sd: 4,
        cv: 4
      },
    }
  },
  inject: ["setBlockNumber", "blockNumber", "epoch", "setPoolCount", "pools", "prices", "setCommonProgress", "blockTime"],
  methods: {
    increaseProgress(expansion) {
      this.progress[expansion]++
      const progressPct = this.progress[expansion] / this.maxProgress[expansion] * 100
      this.setCommonProgress(progressPct, expansion)
    },
    async initGardens() {
      try {
        for (const expansion of ['sd', 'cv']) {
          let gardener = contracts[expansion].gardener

          let plRaw = await gardener.poolLength()
          this.poolCount[expansion] = Number(formatUnits(plRaw, 0))
          this.maxProgress[expansion] += this.poolCount[expansion]
          this.increaseProgress(expansion)

          for (let i=0;i<this.poolCount[expansion];i++) {
            let userInfo = await gardener.userInfo(i, this.userAddress)
            if (userInfo.amount.gt(0)) {
              this.userInfos[expansion][i] = userInfo
              this.userPools[expansion][i] = i
            }
            this.increaseProgress(expansion)
          }
          this.setPoolCount(Object.keys(this.userPools[expansion]).length, expansion)

          let blockNum = await RPCs[expansion].getBlockNumber()
          this.setBlockNumber(blockNum, expansion)

          const epoch = epochs.getCurrentEpoch(blockNum, expansion)
          this.increaseProgress(expansion)
          let rpbRaw
          let multiplier
          if (expansion === "sd") {
            multiplier = epoch.multiplier
            rpbRaw = await gardener.REWARD_PER_BLOCK()
          } else {
            let multiRaw = await gardener.REWARD_MULTIPLIER(epoch.epoch-1)
            multiplier = Number(formatUnits(multiRaw, 0))
            rpbRaw = await gardener.REWARD_PER_SECOND()
          }
          let rewardPerBlock = Number(formatEther(rpbRaw))
          this.totalRewardsPerDay[expansion] = rewardPerBlock * multiplier * 86400 / this.blockTime(expansion)
          this.increaseProgress(expansion)

          let tapRaw = await gardener.totalAllocPoint()
          this.totalAllocPoints[expansion] = Number(formatUnits(tapRaw, 0))
          this.increaseProgress(expansion)
        }
      } catch (e) {
        this.handleError(e)
      }
    },
    calcApr(expansion) {
      const userRewardsPerDay = this.calcUserRewardsPerDay(expansion)
      const tokenPrice = this.prices(expansion)
      const userUsdTotal = _.sumBy(this.pools(expansion), "usdValue")

      if (userRewardsPerDay === 0 || tokenPrice === 0 || userUsdTotal === 0) {
        return 0
      }
      return (userRewardsPerDay * tokenPrice) / userUsdTotal * 100

    },
    calcUserRewardsPerDay(expansion) {
      let userRewardsDay = 0
      for (let pool of this.pools(expansion)) {
        userRewardsDay += (
            pool.allocPoints
            / this.totalAllocPoints[expansion]
            * this.totalRewardsPerDay[expansion]
            * pool.userShare
        )
      }

      return userRewardsDay
    },
    handleError(err) {
      this.error += err
      console.log(err)
    }
  },
  provide() {
    return {
      totalAllocPoints: (expansion) => this.totalAllocPoints[expansion],
      totalRewardsPerDay: (expansion) => this.totalRewardsPerDay[expansion],
      apr: (expansion) => this.calcApr(expansion),
      userRewardsPerDay: (expansion) => this.calcUserRewardsPerDay(expansion),
    }
  },
  mounted() {
    this.initGardens()
  }
}
</script>

<style scoped>

</style>
