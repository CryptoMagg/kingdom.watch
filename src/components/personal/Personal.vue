<template>
  <div class="container">
    <h2>Personal page for<br/>
      <Address :address="userAddress"/>
      <span v-if="profileName.length > 0">({{ profileName }})</span>
    </h2>
    <div class="row justify-content-md-center">
      <div class=" col-md-auto">
        <table class="table border">
          <tbody>
          <tr v-if="prices['JEWEL'] > 0">
            <td class="text-start">Jewel price</td>
            <td class="text-end">${{ prices["JEWEL"].toFixed(2) }}</td>
          </tr>
          <tr v-if="prices['JEWEL'] > 0">
            <td class="text-start">Price age</td>
            <td class="text-end">{{ ((Date.now() - priceGeneratedStamp) / 1000).toFixed(0) }} s</td>
          </tr>

          <tr>
            <td class="text-start">Block number</td>
            <td class="text-end">{{ blockNumber }}</td>
          </tr>

          <tr v-if="blockTime > 0">
            <td class="text-start">Block time</td>
            <td class="text-end">{{ blockTime.toFixed(2) }} s</td>
          </tr>
          <tr v-if="blockTimeMeasureDuration > 0">
            <td class="text-start">Block time measurement period</td>
            <td class="text-end">{{ blockTimeMeasurementString }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="blockNumber > 0">
    </p>
    <br/>
    <p>Pro-tip: Bookmark this page!</p>

    <div class="row">
      <div class="col-lg-8 m-auto">
        <PersonalOverview :user-address="userAddress"/>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <button class="btn btn-primary m-2 w-50" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseBank" aria-expanded="false" aria-controls="collapseBank">
          Bank
        </button>
        <div class="collapse" id="collapseBank">
          <PersonalBank :user-address="userAddress"/>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <button class="btn btn-primary m-2 w-50" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseEpoch" aria-expanded="false" aria-controls="collapseEpoch">
          Epoch
        </button>
        <div class="collapse" id="collapseEpoch">

          <PersonalEpoch/>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <button class="btn btn-primary m-2 w-50" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseGardens"
                aria-expanded="false" aria-controls="collapseGardens">
          Gardens
        </button>
        <div class="collapse" id="collapseGardens">
          <PersonalGardens :user-address="userAddress"/>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button class="btn btn-primary m-2 w-50" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseHeroes"
                aria-expanded="false" aria-controls="collapseHeroes">
          Heroes
        </button>
        <div class="collapse" id="collapseHeroes">

          <PersonalHeroes :user-address="userAddress"/>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button class="btn btn-primary m-2 w-50" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseInventory"
                aria-expanded="false" aria-controls="collapseInventory">
          Inventory
        </button>
        <div class="collapse" id="collapseInventory">

          <PersonalInventory :user-address="userAddress"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalHeroes from "@/components/personal/PersonalHeroes";

const priceCacheMaxAge = 60 * 1000
import timeString from '../../utils/TimeString'

import axios from "axios"
import epochs from '../../data/Epochs'


import Address from "@/components/generic/Address"
import PersonalOverview from "@/components/personal/PersonalOverview"
import PersonalBank from "@/components/personal/PersonalBank"
import PersonalGardens from "@/components/personal/PersonalGardens"
import PersonalEpoch from "@/components/personal/PersonalEpoch";
import PersonalInventory from "@/components/personal/PersonalInventory";

export default {
  name: "Personal",
  components: {
    PersonalInventory,
    PersonalHeroes,
    PersonalOverview,
    Address,
    PersonalBank,
    PersonalGardens,
    PersonalEpoch
  },
  data() {
    return {
      userAddress: "",
      bankBalance: 0.0,
      totalPendingJewels: 0.0,
      blockNumber: 0,
      blockTime: 2,
      blockTimeMeasureDuration: 0,
      epoch: {},
      prices: {JEWEL: 0.0},
      pricesTimestamp: 0,
      priceGeneratedStamp: 0,
      pools: [],
      poolCount: 15,
      commonProgressPct: 0,
      poolProgress: 0,
      bankProgressPct: 0,
      progressPct: 0,
      profileName: "",
      heroTotal: 0,
      heroProgress: 0,
      inventoryTotalJewels: 0,
    }
  },
  methods: {
    poolDone(poolData) {
      this.totalPendingJewels += poolData.pendingRewards
      this.pools.push(poolData)

      this.poolProgress++

      this.calcProgressPct()
    },
    calcProgressPct() {
      const poolProgressPct = this.poolProgress / this.poolCount * 100

      this.progressPct = this.commonProgressPct * 0.2 + poolProgressPct * 0.35 + this.bankProgressPct * 0.1 + this.heroProgress * 0.35
    },
    async loadPrices() {
      if (this.pricesTimestamp + priceCacheMaxAge > Date.now()) {
        console.log("Prices still up to date")
        return
      }

      return axios.get("https://us-east1-dfkwatch-328521.cloudfunctions.net/getPrices")
          .then(response => {
            if (response.status === 200) {
              this.prices = response.data["prices"]
              this.priceGeneratedStamp = response.data["timestamp"]
              this.blockTime = response.data["blockTime"]
              this.blockTimeMeasureDuration = response.data["blockTimeMeasurementDuration"]
              this.pricesTimestamp = Date.now()
            } else {
              console.log(`Got status ${response.status} : ${response.statusText} while loading prices`)
            }
          })
          .catch(err => {
            console.log(`Got ${err} while loading prices`)
          })
    },
  },
  computed: {
    blockTimeMeasurementString() {
      return timeString.timeSpanStringSeconds(this.blockTimeMeasureDuration / 1000)
    },
  },
  provide() {
    return {
      progressPct: () => this.progressPct,
      epoch: () => this.epoch,
      blockTime: () => this.blockTime,
      prices: () => this.prices,
      setBlockNumber: (blockNum) => {
        this.blockNumber = blockNum
        this.epoch = epochs.getCurrentEpoch(blockNum)
      },

      blockNumber: () => this.blockNumber,
      bankBalance: () => this.bankBalance,

      setBankBalance: (balance) => {
        this.bankBalance = balance
        this.bankProgressPct = 100
        this.calcProgressPct()
      },
      setPoolCount: (count) => {
        this.poolCount = count
        this.calcProgressPct()
      },
      poolDone: this.poolDone,
      pools: () => this.pools.sort((a, b) => a.poolId - b.poolId),
      totalPendingJewels: () => this.totalPendingJewels,
      setCommonProgress: (pct) => {
        this.commonProgressPct = pct
        this.calcProgressPct()
      },

      setProfileName: (name) => this.profileName = name,

      setHeroTotal: (total) => this.heroTotal = total,
      heroTotal: () => this.heroTotal,
      setHeroProgress: (pct) => {
        this.heroProgress = pct
        this.calcProgressPct()
      },

      setInventoryTotal: (total) => this.inventoryTotalJewels = total,
      inventoryTotal: () => this.inventoryTotalJewels
    }
  },
  created() {
    if (this.$route.params.userAddress) {
      this.userAddress = this.$route.params.userAddress
    }
  },
  mounted() {
    this.loadPrices()
    this.$gtag.event("LoadPersonal")
  }
}
</script>

<style scoped>
</style>
