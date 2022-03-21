<template>
  <div class="border border-dark rounded-3">
    <h3 class="p-3">Overview</h3>
    <div v-if="progressBarWidth < 100" class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated"
           role="progressbar"
           aria-valuenow="0"
           aria-valuemin="0"
           aria-valuemax="100"
           :style="{width: (progressBarWidth) + '%'}">
      </div>
    </div>
    <div>
      <table class="table table-hover w-100">
        <thead>
        <tr>
          <th class="text-start">Grand Total</th>
          <th></th>
          <th class="text-end">{{ formatNumber(grandTotalUsd, '$') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="text-start">Available Jewels</td>
          <td class="text-end">{{ formatNumber(totalAvailableJewels) }}</td>
          <td class="text-end">{{ formatNumber(totalAvailableJewels * jewelPrice, '$') }}</td>
        </tr>
        <tr>
          <td class="text-start">
            <span class="form-check form-switch">
              <label class="form-check-label" for="flexSwitchLocked">Locked Jewels</label>
              <input v-model="includeLocked" class="form-check-input" type="checkbox" role="switch"
                     id="flexSwitchLocked">
            </span>

          </td>
          <td class="text-end"><span v-if="includeLocked">{{ formatNumber(totalLockedJewels) }}</span></td>
          <td class="text-end"><span v-if="includeLocked">{{ formatNumber(totalLockedJewels * jewelPrice, '$') }}</span></td>
        </tr>
        <tr>
          <td class="text-start">
            <span class="form-check form-switch">
              <label class="form-check-label" for="flexSwitchHeroes">Heroes</label>
              <input v-model="includeHeroes" class="form-check-input" type="checkbox" role="switch"
                     id="flexSwitchHeroes">
            </span>
          </td>
          <td class="text-end">
            <span v-if="includeHeroes">{{ formatNumber(heroTotal()) }}</span>
          </td>
          <td class="text-end">
            <span v-if="includeHeroes">{{ formatNumber(heroTotal() * jewelPrice, '$') }}</span>
          </td>
        </tr>
        <tr>
          <td class="text-start">
            <span class="form-check form-switch">
              <label class="form-check-label" for="flexSwitchInventory">Inventory</label>
              <input v-model="includeInventory" class="form-check-input" type="checkbox" role="switch"
                     id="flexSwitchInventory">
            </span>
          </td>
          <td class="text-end">
            <span v-if="includeInventory">{{ formatNumber(inventoryTotal()) }}</span>
          </td>
          <td class="text-end">
            <span v-if="includeInventory">{{ formatNumber(inventoryTotal() * jewelPrice, '$') }}</span>
          </td>
        </tr>
        <tr>
          <td class="text-start">Gardens</td>
          <td class="text-end"></td>
          <td class="text-end">{{ formatNumber(totalPoolUsd, '$') }}</td>
        </tr>
        <tr>
          <td colspan="3">&nbsp;</td>
        </tr>
        </tbody>

        <thead>
        <tr>
          <th class="text-start">Available Jewels</th>
          <th class="text-end">{{ formatNumber(totalAvailableJewels) }}</th>
          <th class="text-end">{{ formatNumber(totalAvailableJewels * jewelPrice, '$') }}</th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td class="text-start">Wallet Jewels</td>
          <td class="text-end">{{ formatNumber(walletBalanceJewels) }}</td>
          <td class="text-end">{{ formatNumber(walletBalanceJewels * jewelPrice, '$') }}</td>
        </tr>
        <tr>
          <td class="text-start">Bank Jewels</td>
          <td class="text-end">{{ formatNumber(this.bankBalance()) }}</td>
          <td class="text-end">{{ formatNumber(this.bankBalance() * jewelPrice, '$') }}</td>
        </tr>
        <tr>
          <td class="text-start">Pending Unlocked Jewels</td>
          <td class="text-end">{{ formatNumber(pendingUnlockedJewels) }}</td>
          <td class="text-end">{{ formatNumber(pendingUnlockedJewels * jewelPrice, '$') }}</td>
        </tr>
        <tr>
          <td colspan="3">&nbsp;</td>
        </tr>
        </tbody>

        <thead>
        <tr>
          <th class="text-start">Locked Jewels</th>
          <th class="text-end">{{ formatNumber(totalLockedJewels) }}</th>
          <th class="text-end">{{ formatNumber(totalLockedJewels * jewelPrice, '$') }}</th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td class="text-start">Currently Locked Jewels</td>
          <td class="text-end">{{ formatNumber(lockedBalance) }}</td>
          <td class="text-end">{{ formatNumber(lockedBalance * jewelPrice, '$') }}</td>
        </tr>
        <tr>
          <td class="text-start">Pending Locked Jewels</td>
          <td class="text-end">{{ formatNumber(pendingLockedJewels) }}</td>
          <td class="text-end">{{ formatNumber(pendingLockedJewels * jewelPrice, '$') }}</td>
        </tr>
        <tr>
          <td colspan="3">&nbsp;</td>
        </tr>
        </tbody>

        <thead>
        <tr>
          <th class="text-start">Hero Floor</th>
          <th class="text-end">{{ formatNumber(heroTotal()) }}</th>
          <th class="text-end">{{ formatNumber(heroTotal() * jewelPrice, '$') }}</th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td class="text-start">Hero floor</td>
          <td class="text-end">{{ formatNumber(heroTotal()) }}</td>
          <td class="text-end">{{ formatNumber(heroTotal() * jewelPrice, '$') }}</td>
        </tr>
        <tr>
          <td colspan="3">&nbsp;</td>
        </tr>
        </tbody>

        <thead>
        <tr>
          <th class="text-start">
            Gardens
            <span @click="toggleSort('name', 1)">^</span>
            <span @click="toggleSort('name', -1)">v</span>
          </th>
          <th class="text-end">
            <span @click="toggleSort('apr', 1)">^</span>
            <span @click="toggleSort('apr', -1)">v</span>
            APR
          </th>
          <th class="text-end">
            <span @click="toggleSort('usd', 1)">^</span>
            <span @click="toggleSort('usd', -1)">v</span>
            {{ formatNumber(totalPoolUsd, '$') }}
          </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="pool in sortedPools" :key="pool">
          <td class="text-start">{{ pool.poolName }} <span v-if="pool.userUnstaked >0"
                                                           class="text-danger">Unstaked LP</span></td>
          <td class="text-end">{{ formatNumber(pool.apr() * 365) }}%</td>
          <td class="text-end">{{ formatNumber(pool.usdValue, '$') }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
const formatNumber = require('../../utils/FormatNumber')
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

const jewelContractJson = require("../../data/Jewel.json");
const jewelContractAddress = "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F";

const jewelContract = hmy.contracts.createContract(jewelContractJson.abi, jewelContractAddress);


export default {
  name: "PersonalOverview",
  props: ["userAddress"],
  data() {
    return {
      lockedBalance: 0,
      walletBalanceJewels: 0,
      localProgress: 0,
      includeHeroes: true,
      includeInventory: true,
      includeLocked: true,
      poolSort: {
        id: 1,
        name: 0,
        apr: 0,
        usd: 0
      },
    }
  },
  inject: [
    "totalPendingJewels",
    "epoch",
    "bankBalance",
    "prices",
    "progressPct",
    "pools",
    "heroTotal",
    "inventoryTotal"
  ],
  methods: {
    formatNumber(num, prefix) {
      return formatNumber(num, prefix)
    },
    toggleSort(field, dir) {
      this.poolSort = {
        id: 0,
        name: 0,
        apr: 0,
        usd: 0
      }

      this.poolSort[field] = dir
      console.log(this.poolSort)
    },
    async loadWalletAndLocked() {
      this.lockedBalance = (await jewelContract.methods.lockOf(this.userAddress).call()) / 1e18
      this.localProgress++
      this.walletBalanceJewels = (await jewelContract.methods.balanceOf(this.userAddress).call()) / 1e18
      this.localProgress++
    }
  },
  computed: {
    sortedPools() {
      let sp = []
      const pools = [...this.pools()]

      if (this.poolSort.name > 0)
        sp = pools.sort((a, b) => b.poolName.localeCompare(a.poolName))
      else if (this.poolSort.name < 0)
        sp = pools.sort((a, b) => a.poolName.localeCompare(b.poolName))

      else if (this.poolSort.apr > 0)
        sp = pools.sort((a, b) => a.apr() - b.apr())
      else if (this.poolSort.apr < 0)
        sp = pools.sort((a, b) => b.apr() - a.apr())

      else if (this.poolSort.usd > 0)
        sp = pools.sort((a, b) => a.usdValue - b.usdValue)
      else if (this.poolSort.usd < 0)
        sp = pools.sort((a, b) => b.usdValue - a.usdValue)

      else
        sp = pools

      return sp
    },
    progressBarWidth() {
      const poolBankPct = this.progressPct() * 0.8
      const localPct = this.localProgress / 2 * 0.2 * 100

      return poolBankPct + localPct
    },

    jewelPrice() {
      return this.prices()["JEWEL"]
    },

    grandTotalUsd() {
      let grandTotal = this.totalAvailableJewels * this.jewelPrice

      if (this.includeLocked)
        grandTotal += this.totalLockedJewels * this.jewelPrice

      if (this.includeHeroes)
        grandTotal += this.heroTotal() * this.jewelPrice

      if(this.includeInventory)
        grandTotal += this.inventoryTotal() * this.jewelPrice

      grandTotal += this.totalPoolUsd
      return grandTotal
    },

    totalAvailableJewels() {
      return this.walletBalanceJewels + this.bankBalance() + this.pendingUnlockedJewels
    },

    totalLockedJewels() {
      return this.lockedBalance + this.pendingLockedJewels
    },

    totalPoolUsd() {
      let runningTotal = 0

      for (let pool of this.pools())
        runningTotal += pool.usdValue

      return runningTotal
    },

    pendingUnlockedJewels() {
      return this.totalPendingJewels() * this.epoch().unlock / 100
    },

    pendingLockedJewels() {
      return this.totalPendingJewels() * (100 - this.epoch().unlock) / 100
    },


  },
  mounted() {
    this.loadWalletAndLocked()
  }

}
</script>

<style scoped>

</style>