<template>
  <div class="border border-dark rounded-3">
    <h3 class="p-3">Overview</h3>
    <div v-if="anyProgressLeft">
      <div v-for="[symbol, expansion] of [['Serendale', 'sd'], ['Crystalvale', 'cv'], ['Serendale 2.0', 'sd2']]" class="progress" :key="expansion">
        <div class="progress-bar progress-bar-striped progress-bar-animated text-white" :class="expansion==='sd'?'bg-success':'bg-info'"
             role="progressbar"
             aria-valuenow="0"
             aria-valuemin="0"
             aria-valuemax="100"
             :style="{width: (progressBarWidth(expansion)) + '%'}">{{ symbol }}
        </div>
      </div>
    </div>
    <div>
      <table class="table table-hover w-100">
        <thead>
        <tr>
          <th class="text-start" colspan="2">Grand Total</th>
          <th class="text-end">{{ formatNumber(grandTotalUsd("sd") + grandTotalUsd('cv')  + grandTotalUsd('sd2'), '$') }}</th>
        </tr>
        </thead>
        <thead>
        <tr v-for="[symbol, expansion] of [['Serendale (Harmony)', 'sd'], ['Crystalvale (DFK Chain)', 'cv'], ['Serendale 2.0 (Klaytn)', 'sd2']]" :key="symbol">
          <th class="text-start ps-5">{{ symbol }}</th>
          <th class="text-end" colspan="2">{{ formatNumber(grandTotalUsd(expansion), '$') }}</th>
        </tr>
        </thead>
        <tbody>

        <tr><td colspan="3"></td></tr>

        <tr>
          <td class="text-start" colspan="2">Available</td>
          <th class="text-end">
            {{ formatNumber((totalAvailable('sd') * tokenPrice('sd')) + (totalAvailable('cv') * tokenPrice('cv')) + (totalAvailable('sd2') * tokenPrice('sd2')), '$') }}
          </th>
        </tr>
        <tr v-for="[symbol, expansion] of [['Jewel', 'sd'], ['Crystal', 'cv'],['Jade', 'sd2']]" :key="symbol">
          <td class="text-start ps-5">{{ symbol }}</td>
          <td class="text-end">{{ formatNumber(totalAvailable(expansion)) }}</td>
          <td class="text-end">{{ formatNumber(totalAvailable(expansion) * tokenPrice(expansion), '$') }}</td>
        </tr>

        <tr><td colspan="3"></td></tr>

        <tr>
          <td class="text-start" colspan="2">
            <span class="form-check form-switch">
              <input v-model="includeLocked" class="form-check-input" type="checkbox" role="switch" id="flexSwitchLocked">
              <label class="form-check-label" for="flexSwitchLocked">Locked</label>
            </span>
          </td>
          <th class="text-end">
            {{ formatNumber(includeLocked?(totalLocked('sd2')*tokenPrice('sd2'))+(totalLocked('cv') * tokenPrice('cv')):0, '$') }}
          </th>
        </tr>
        <tr v-for="[symbol, expansion] of [['Crystal', 'cv'],['Jade', 'sd2']]" :key="symbol">
          <td class="text-start ps-5">{{ symbol }}</td>
          <td class="text-end">
            <span>{{ formatNumber(includeLocked ? totalLocked(expansion) : 0) }}</span>
          </td>
          <td class="text-end">
            <span>{{ formatNumber(includeLocked ? totalLocked(expansion) * tokenPrice(expansion) : 0, '$') }}</span>
          </td>
        </tr>

        <tr><td colspan="3"></td></tr>

        <tr>
          <td class="text-start" colspan="2">
            <span class="form-check form-switch">
              <input v-model="includeHeroes" class="form-check-input" type="checkbox" role="switch" id="flexSwitchHeroes">
              <label class="form-check-label" for="flexSwitchHeroes">Heroes</label>
            </span>
          </td>
          <th class="text-end">
            {{ formatNumber(includeHeroes?(heroTotal('sd')*tokenPrice('sd'))+(heroTotal('cv') * tokenPrice('cv')):0, '$') }}
          </th>
        </tr>
        <tr v-for="[symbol, expansion] of [['Serendale', 'sd'], ['Crystalvale', 'cv'], ['Serendale 2.0', 'sd2']]" :key="symbol">
          <td class="text-start ps-5">{{ symbol }}</td>
          <td class="text-end">
            <span>{{ formatNumber(includeHeroes ? heroTotal(expansion) : 0) }}</span>
          </td>
          <td class="text-end">
            <span>{{ formatNumber(includeHeroes ? heroTotal(expansion) * tokenPrice(expansion) : 0, '$') }}</span>
          </td>
        </tr>

        <tr><td colspan="3"></td></tr>

        <tr>
          <td class="text-start" colspan="2">
            <span class="form-check form-switch">
              <input v-model="includeInventory" class="form-check-input" type="checkbox" role="switch" id="flexSwitchInventory">
               <label class="form-check-label" for="flexSwitchInventory">Inventory</label>
            </span>
          </td>
          <th class="text-end">
            {{ formatNumber(includeInventory?(inventoryTotal('sd')*tokenPrice('sd'))+(inventoryTotal('cv') * tokenPrice('sd'))+(inventoryTotal('sd2') * tokenPrice('sd')):0, '$') }}
          </th>
        </tr>
        <tr v-for="[symbol, expansion] of [['Serendale', 'sd'], ['Crystalvale', 'cv'], ['Serendale 2.0', 'sd2']]" :key="symbol">
          <td class="text-start ps-5">{{ symbol }}</td>
          <td class="text-end">
            <span>{{ formatNumber(includeInventory ? inventoryTotal(expansion) : 0) }}</span>
          </td>
          <td class="text-end">
            <span>{{ formatNumber(includeInventory ? inventoryTotal(expansion) * tokenPrice('sd') : 0, '$') }}</span>
          </td>
        </tr>

        <tr><td colspan="3"></td></tr>

        <tr>
          <td class="text-start" colspan="2">Gardens</td>
          <th class="text-end">
            <span>{{ formatNumber(totalPoolUsd('sd') + totalPoolUsd('cv') + totalPoolUsd('sd2'), '$') }}</span>
          </th>
        </tr>
        <tr v-for="[symbol, expansion] of [['Serendale', 'sd'], ['Crystalvale', 'cv'], ['Serendale 2.0', 'sd2']]" :key="symbol">
          <td class="text-start ps-5">{{ symbol }}</td>
          <td class="text-end" colspan="2">{{ formatNumber(totalPoolUsd(expansion), '$') }}</td>
        </tr>
        <tr>
          <td colspan="3">&nbsp;</td>
        </tr>
        </tbody>

        <thead>
        <tr>
          <th class="text-start" colspan="2">Available</th>
          <th class="text-end">
            {{ formatNumber((totalAvailable('sd')*tokenPrice('sd'))+(totalAvailable('cv')*tokenPrice('cv'))+(totalAvailable('sd2')*tokenPrice('sd2')), '$') }}
          </th>
        </tr>
        </thead>
        <thead>
        <tr v-for="[symbol, expansion] of [['Jewel', 'sd'], ['Crystal', 'cv'], ['Jade', 'sd2']]" :key="symbol">
          <th class="text-start ps-5">{{ symbol }}</th>
          <th class="text-end">{{ formatNumber(totalAvailable(expansion)) }}</th>
          <th class="text-end">{{ formatNumber(totalAvailable(expansion) * tokenPrice(expansion), '$') }}</th>
        </tr>
        </thead>
        <tbody>

        <tr><td colspan="3"></td></tr>

        <tr>
          <th class="text-start" colspan="2">Wallet</th>
          <th class="text-end">
            {{ formatNumber((TotalJewelHeld * tokenPrice('sd'))+(walletBalance['sd2']*tokenPrice('sd2'))+(walletBalance['cv']*tokenPrice('cv')), '$') }}
          </th>
        </tr>
		<tr>
			<td class="text-start ps-5">Jewel</td>
         <td class="text-end">{{ formatNumber(TotalJewelHeld) }}</td>
         <td class="text-end">{{ formatNumber(TotalJewelHeld * tokenPrice('sd'), '$') }}</td>
		</tr>
        <tr v-for="[symbol, expansion] of [['Crystal', 'cv'], ['Jade', 'sd2']]" :key="symbol">
          <td class="text-start ps-5">{{ symbol }}</td>
          <td class="text-end">{{ formatNumber(walletBalance[expansion]) }}</td>
          <td class="text-end">{{ formatNumber(walletBalance[expansion] * tokenPrice(expansion), '$') }}</td>
        </tr>

        <tr><td colspan="3"></td></tr>

        <tr>
          <th class="text-start" colspan="2">Bank</th>
          <th class="text-end">
            {{ formatNumber((this.bankBalance('sd')*tokenPrice('sd'))+(this.bankBalance('cv')*tokenPrice('cv')), '$') }}
          </th>
        </tr>
        <tr v-for="[symbol, expansion] of [['Jewel', 'sd'], ['Crystal', 'cv'], ['Jade', 'sd2']]" :key="symbol">
          <td class="text-start ps-5">{{ symbol }}</td>
          <td class="text-end">{{ formatNumber(this.bankBalance(expansion)) }}</td>
          <td class="text-end">{{ formatNumber(this.bankBalance(expansion) * tokenPrice(expansion), '$') }}</td>
        </tr>

        <tr><td colspan="3"></td></tr>

        <tr>
          <th class="text-start" colspan="2">Pending Unlocked</th>
          <th class="text-end">
            {{ formatNumber((pendingUnlocked('sd2')*tokenPrice('sd2'))+(pendingUnlocked('cv')*tokenPrice('cv')), '$') }}
          </th>
        </tr>
        <tr v-for="[symbol, expansion] of [['Crystal', 'cv'], ['Jade', 'sd2']]" :key="symbol">
          <td class="text-start ps-5">{{ symbol }}</td>
          <td class="text-end">{{ formatNumber(pendingUnlocked(expansion)) }}</td>
          <td class="text-end">{{ formatNumber(pendingUnlocked(expansion) * tokenPrice(expansion), '$') }}</td>
        </tr>
        <tr>
          <td colspan="3">&nbsp;</td>
        </tr>
        </tbody>

        <thead>
        <tr>
          <th class="text-start" colspan="2">Locked</th>
          <th class="text-end">
            {{ formatNumber((totalLocked('sd2')*tokenPrice('sd2'))+(totalLocked('cv')*tokenPrice('cv')), '$') }}
          </th>
        </tr>
        </thead>
        <thead>
        <tr v-for="[symbol, expansion] of [['Crystal', 'cv'], ['Jade', 'sd2']]" :key="symbol">
          <th class="text-start ps-5">{{ symbol }}</th>
          <th class="text-end">{{ formatNumber(totalLocked(expansion)) }}</th>
          <th class="text-end">{{ formatNumber(totalLocked(expansion) * tokenPrice(expansion), '$') }}</th>
        </tr>
        </thead>

        <tbody>

        <tr><td colspan="3"></td></tr>

        <tr>
          <th class="text-start" colspan="2">Currently Locked</th>
          <th class="text-end">
            {{ formatNumber((lockedBalance['sd2']*tokenPrice('sd2'))+(lockedBalance['cv']*tokenPrice('cv')), '$') }}
          </th>
        </tr>
        <tr v-for="[symbol, expansion] of [['Crystal', 'cv'], ['Jade', 'sd2']]" :key="symbol">
          <td class="text-start ps-5">{{ symbol }}</td>
          <td class="text-end">{{ formatNumber(lockedBalance[expansion]) }}</td>
          <td class="text-end">{{ formatNumber(lockedBalance[expansion] * tokenPrice(expansion), '$') }}</td>
        </tr>

        <tr><td colspan="3"></td></tr>

        <tr>
          <th class="text-start" colspan="2">Pending Locked</th>
          <th class="text-end">
            {{ formatNumber(
					(pendingLocked('sd2')*tokenPrice('sd2'))+(pendingLocked('cv')*tokenPrice('cv')), '$') }}
          </th>
        </tr>
        <tr v-for="[symbol, expansion] of [['Crystal', 'cv'], ['Jade', 'sd2']]" :key="symbol">
          <td class="text-start ps-5">{{ symbol }}</td>
          <td class="text-end">{{ formatNumber(pendingLocked(expansion)) }}</td>
          <td class="text-end">{{ formatNumber(pendingLocked(expansion) * tokenPrice(expansion), '$') }}</td>
        </tr>
        <tr>
          <td colspan="3">&nbsp;</td>
        </tr>
        </tbody>

        <thead>
        <tr>
          <th class="text-start" colspan="2">Hero Floor</th>
          <th class="text-end">
            {{ formatNumber((heroTotal('sd')*tokenPrice('sd'))+(heroTotal('cv')*tokenPrice('cv')), '$') }}
          </th>
        </tr>
        </thead>

        <tbody>

        <tr><td colspan="3"></td></tr>

        <tr v-for="[symbol, expansion] of [['Serendale', 'sd'], ['Crystalvale', 'cv'], ['Serendale 2.0', 'sd2']]" :key="symbol">
          <th class="text-start ps-5">{{ symbol }}</th>
          <th class="text-end">{{ formatNumber(heroTotal(expansion)) }}</th>
          <th class="text-end">{{ formatNumber(heroTotal(expansion) * tokenPrice(expansion), '$') }}</th>
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

        <tbody v-for="[symbol, expansion] of [['Serendale', 'sd'], ['Crystalvale', 'cv'], ['Serendale 2.0', 'sd2']]" :key="symbol">
        <tr><td colspan="3"></td></tr>
          <tr>
            <th class="text-start">
              {{ symbol }}
              <span @click="toggleSort('name', 1, expansion)">^</span>
              <span @click="toggleSort('name', -1, expansion)">v</span>
            </th>
            <th class="text-end">
              <span @click="toggleSort('apr', 1, expansion)">^</span>
              <span @click="toggleSort('apr', -1, expansion)">v</span>
              APR
            </th>
            <th class="text-end">
              <span @click="toggleSort('usd', 1, expansion)">^</span>
              <span @click="toggleSort('usd', -1, expansion)">v</span>
              {{ formatNumber(totalPoolUsd, '$') }}
            </th>
          </tr>
          <tr v-if="sortedPools(expansion).length === 0">
            <td class="text-start">
              No pools
            </td>
          </tr>
          <tr v-for="pool in sortedPools(expansion)" :key="pool">
            <td class="text-start">{{ pool.poolName }}
              <span v-if="pool.userUnstaked >0" class="text-danger">Unstaked LP</span>
            </td>
            <td class="text-end">{{ formatNumber(pool.apr() * 365) }}%</td>
            <td class="text-end">{{ formatNumber(pool.usdValue, '$') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import formatNumber from "@/utils/FormatNumber"
import { contracts, formatEther, RPCs } from "@/utils/ethers"

export default {
  name: "PersonalOverview",
  props: ["userAddress"],
  data() {
    return {
      lockedBalance: { sd: 0, cv: 0 },
      walletBalance: { sd: 0, cv: 0 },
      localProgress: { sd: 0, cv: 0 },
		TotalJewelHeld: 0,
      includeHeroes: true,
      includeInventory: true,
      includeLocked: true,
      poolSort: {
        sd: { id: 1, name: 0, apr: 0, usd: 0 },
        cv: { id: 1, name: 0, apr: 0, usd: 0 },
		sd2: { id: 1, name: 0, apr: 0, usd: 0 }
      }
    }
  },
  inject: [ "totalPending", "epoch", "bankBalance", "prices", "progressPct", "pools", "heroTotal", "inventoryTotal" ],
  methods: {
    formatNumber(num, prefix) {
      return formatNumber(num, prefix)
    },
    toggleSort(field, dir, expansion) {
      for (const exp of ['sd', 'cv','sd2']) {
        if (expansion === exp || !expansion) {
          this.poolSort[exp] = { id: 1, name: 0, apr: 0, usd: 0 }
          this.poolSort[exp][field] = dir
        }
      }
    },
    async loadWalletAndLocked() {
      for (const expansion of ["sd", "cv", "sd2"]) {
			let lockedRaw = await contracts[expansion].token.lockOf(this.userAddress)
			if(expansion === "sd"){
				this.lockedBalance[expansion] = 0;
			}
			else{
				this.lockedBalance[expansion] = Number(formatEther(lockedRaw))
			}
			this.localProgress[expansion]++

			let balRaw = await contracts[expansion].token.balanceOf(this.userAddress)
			this.walletBalance[expansion] = Number(formatEther(balRaw))
			this.TotalJewelHeld = await this.calcJewelHeld();
			this.localProgress[expansion]++
      }
    },
    grandTotalUsd(expansion) {
      let grandTotal;
		if(expansion==='sd'){
			grandTotal = this.walletBalance[expansion] + this.bankBalance(expansion) + this.pendingUnlocked(expansion)
		}
		else{
			grandTotal = this.totalAvailable(expansion) * this.tokenPrice(expansion)
		}
      if (this.includeLocked)
        grandTotal += this.totalLocked(expansion) * this.tokenPrice(expansion)
      if (this.includeHeroes)
        grandTotal += this.heroTotal(expansion) * this.tokenPrice(expansion)
      if(this.includeInventory)
        grandTotal += this.inventoryTotal(expansion) * this.tokenPrice('sd') // all demoninated in JEWEL atm - maybe change this
      grandTotal += this.totalPoolUsd(expansion)
      return grandTotal
    },
    totalAvailable(expansion) {
		if(expansion === 'sd'){
			let totJewel =  this.TotalJewelHeld; 
			return totJewel;
		}
		else{
			return this.walletBalance[expansion] + this.bankBalance(expansion) + this.pendingUnlocked(expansion)
		}
    },
	async calcJewelHeld() {
		let totalJewel = 0;
		//sd
		let balRaw = await contracts['sd'].token.balanceOf(this.userAddress);
		totalJewel = Number(formatEther(balRaw));
		//cv
		let cvRawBal = await RPCs['cv'].getBalance(this.userAddress);
		totalJewel += Number(formatEther(cvRawBal));
		//sd2
		let klayBalRaw = await contracts['sd2'].jewel.balanceOf(this.userAddress);
		totalJewel += Number(formatEther(klayBalRaw));
		return totalJewel;
	},
    totalLocked(expansion) {
      return this.lockedBalance[expansion] + this.pendingLocked(expansion)
    },
    totalPoolUsd(expansion) {
      let runningTotal = 0
      for (let pool of this.pools(expansion)) {
        runningTotal += pool.usdValue
      }
      return runningTotal
    },
    pendingUnlocked(expansion) {
      return this.totalPending(expansion) * this.epoch(expansion).unlock / 100
    },
    pendingLocked(expansion) {
      return this.totalPending(expansion) * (100 - this.epoch(expansion).unlock) / 100
    },
    sortedPools(expansion) {
      let sp = []
      const pools = [...this.pools(expansion)]
      if (this.poolSort[expansion].name > 0)
        sp = pools.sort((a, b) => b.poolName.localeCompare(a.poolName))
      else if (this.poolSort[expansion].name < 0)
        sp = pools.sort((a, b) => a.poolName.localeCompare(b.poolName))

      else if (this.poolSort[expansion].apr > 0)
        sp = pools.sort((a, b) => a.apr() - b.apr())
      else if (this.poolSort[expansion].apr < 0)
        sp = pools.sort((a, b) => b.apr() - a.apr())

      else if (this.poolSort[expansion].usd > 0)
        sp = pools.sort((a, b) => a.usdValue - b.usdValue)
      else if (this.poolSort[expansion].usd < 0)
        sp = pools.sort((a, b) => b.usdValue - a.usdValue)

      else
        sp = pools

      return sp
    },
    progressBarWidth(expansion) {
      const poolBankPct = this.progressPct(expansion) * 0.8
      const localPct = this.localProgress[expansion] / 2 * 0.2 * 100

      return poolBankPct + localPct
    },
    tokenPrice(expansion) {
      return this.prices(expansion)
    }
  },
  computed: {
    anyProgressLeft() {
      return this.progressBarWidth('sd') < 100 || this.progressBarWidth('cv') < 100 || this.progressBarWidth('sd2') < 100
    }
  },
  mounted() {
    this.loadWalletAndLocked()
  }

}
</script>

<style scoped>

</style>
