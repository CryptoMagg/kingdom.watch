<template>
  <div class="container">
    <h2>Personal page for<br/>
      <Address :address="userAddress"/>
      <span v-if="profileName.length > 0">({{ profileName }})</span>
    </h2>
    <div class="row justify-content-md-center">
      <div class="col-md-auto">
        <table class="table border">
          <thead>
          <tr>
            <th scope="col">Symbol</th>
            <th scope="col">Price</th>
            <th scope="col">Update</th>
            <th scope="col">Block #</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="[symbol, expansion] of [['JEWEL', 'sd'], ['CRYSTAL', 'cv']]" :key="symbol">
            <td>{{ symbol }}</td>
            <td>${{ prices[symbol].toFixed(2) }}</td>
            <td>30s</td>
            <td>{{ blockNumber[expansion] }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

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
import { contractAddrs, expansionSet } from "@/utils/ethers"

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
      bankBalance: {...expansionSet},
      totalPending: {...expansionSet},
      blockNumber: {...expansionSet},
      blockTime: {
        sd: 2,
        cv: 1
      },
      blockTimeMeasureDuration: {
        sd: 604800,
        cv: 604800
      },
      epoch: {
        sd: {},
        cv: {}
      },
      prices: {
        JEWEL: 0.0,
        CRYSTAL: 0.0,
      },
      pricesTimestamp: 0,
      priceGeneratedStamp: 0,
      pools: {
        sd: [],
        cv: []
      },
      poolCount: {...expansionSet},
      commonProgressPct: {...expansionSet},
      poolProgress: {...expansionSet},
      bankProgressPct: {...expansionSet},
      progressPct: {...expansionSet},
      profileName: "",
      heroTotal: {...expansionSet},
      heroProgress: {...expansionSet},
      inventoryTotal: {...expansionSet},
    }
  },
  methods: {
    poolDone(poolData, expansion) {
      this.totalPending[expansion] += poolData.pendingRewards
      this.pools[expansion].push(poolData)

      this.poolProgress[expansion]++

      this.calcProgressPct()
    },
    calcProgressPct() {
      for (const expansion of ["sd", "cv"]) {
        this.progressPct[expansion] = (
            this.commonProgressPct[expansion] * 0.2
            + (this.poolProgress[expansion] / this.poolCount[expansion] * 100) * 0.35
            + this.bankProgressPct[expansion] * 0.1 + this.heroProgress[expansion] * 0.35
        )
      }
    },
    async loadPrices() {
      if (this.pricesTimestamp + priceCacheMaxAge > Date.now()) {
        console.log("Prices still up to date")
        return
      }
      const dsPrefix = "https://api.dexscreener.io/latest/dex/tokens/"
      const expSet = [
        ["JEWEL", contractAddrs.sd.jewel],
        ["CRYSTAL", contractAddrs.cv.crystal]
      ]
      for (const [symbol, addr] of expSet) {
        let r = await axios.get(dsPrefix + addr)
        if (r.status === 200) {
          let pairs = r.data.pairs.filter(pair => pair.dexId === "defikingdoms")
          this.prices[symbol] = Number(pairs[0].priceUsd)
        } else {
          console.log(`Got status ${r.status} : ${r.statusText} while loading prices`)
        }
      }
      this.pricesTimestamp = Date.now()
    },
  },
  computed: {
    blockTimeMeasurementString() {
      return timeString.timeSpanStringSeconds(604800 / 1000)
    },
  },
  provide() {
    return {
      progressPct: (expansion) => this.progressPct[expansion],
      epoch: (expansion) => this.epoch[expansion],
      blockTime: (expansion) => this.blockTime[expansion],
      prices: (expansion) => expansion ? this.prices[expansion==="sd"?"JEWEL":"CRYSTAL"] : this.prices,
      setBlockNumber: (blockNum, expansion) => {
        this.blockNumber[expansion] = blockNum
        this.epoch[expansion] = epochs.getCurrentEpoch(blockNum, expansion)
      },

      blockNumber: (expansion) => this.blockNumber[expansion],
      bankBalance: (expansion) => this.bankBalance[expansion],

      setBankBalance: (balance, expansion) => {
        this.bankBalance[expansion] = balance
        this.bankProgressPct[expansion] = 100
        this.calcProgressPct()
      },
      setPoolCount: (count, expansion) => {
        this.poolCount[expansion] = count
        this.calcProgressPct()
      },
      poolDone: this.poolDone,
      pools: (expansion) => {
        if (!expansion) return []
        return this.pools[expansion].sort((a, b) => a.poolId - b.poolId)
      },
      totalPending: (expansion) => this.totalPending[expansion],
      setCommonProgress: (pct, expansion) => {
        this.commonProgressPct[expansion] = pct
        this.calcProgressPct()
      },

      setProfileName: (name) => this.profileName = name,

      setHeroTotal: (total, expansion) => this.heroTotal[expansion] = total,
      heroTotal: (expansion) => this.heroTotal[expansion],
      setHeroProgress: (pct, expansion) => {
        this.heroProgress[expansion] = pct
        this.calcProgressPct()
      },

      setInventoryTotal: (total, expansion) => this.inventoryTotal[expansion] = total,
      inventoryTotal: (expansion) => this.inventoryTotal[expansion]
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
