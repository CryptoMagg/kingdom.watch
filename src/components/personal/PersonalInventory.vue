<template>
  <div>
  <div v-for="[symbol, expansion] of [['Serendale (Harmony)', 'sd'], ['Crystalvale (DFKChain)', 'cv'], ['Serendale 2.0 (Klatyn)', 'sd2']]" :key="symbol">
    <h3>{{symbol}}</h3>
    <hr/>
    <div v-if="items[expansion].length > 1 || items[expansion][0]?.balance != 0">
      <table class="table table-hover w-100">
        <thead>
          <tr>
            <th/>
            <th class="text-start">Item<SortIcon field="name"/></th>
            <th class="text-end">Balance<SortIcon field="balance"/></th>
            <th class="text-end">Jewel Price<SortIcon field="price"/></th>
            <th class="text-end">Jewels<SortIcon field="totalJewel"/></th>
            <th class="text-end">Jewel USD</th>
            <th class="text-end">Gold Price<SortIcon field="priceGold"/></th>
            <th class="text-end">Gold<SortIcon field="gold"/></th>
            <th class="text-end">Gold USD</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sortedItems(expansion)" :key="item">
            <td><img height="25" width="25" :src="item.logoURI" :alt="item.name" /></td>
            <td class="text-start">{{ item.name }}</td>
            <td class="text-end">{{ item.balance }}</td>
            <td class="text-end"><span v-if="item.jewelPrice">{{ formatNumber(item.jewelPrice) }}</span></td>
            <td class="text-end"><span v-if="item.jewelPrice">{{ formatNumber(item.totalJewel) }}</span></td>
            <td class="text-end" :class="betterJewelTrade(item)">
              <span v-if="item.jewelPrice">{{ formatNumber(item.totalJewelUsd, '$') }}</span>
            </td>
            <td class="text-end"><span v-if="item.goldPrice">{{ formatNumber(item.goldPrice) }}</span></td>
            <td class="text-end"><span v-if="item.goldPrice">{{ formatNumber(item.totalGold) }}</span></td>
            <td :class="betterGoldTrade(item)" class="text-end ">
              <span v-if="item.goldPrice">{{formatNumber(item.totalGoldUsd, '$') }}</span>
            </td>
        </tr>
        </tbody>
        <tfoot>
          <tr>
            <th class="text-end" colspan="5">{{ formatNumber(totalJewels(expansion)) }}</th>
            <th class="text-end">{{ formatNumber(totalJewelUsd(expansion), '$') }}</th>
            <th class="text-end" colspan="2">{{ formatNumber(totalGold(expansion)) }}</th>
            <th class="text-end">{{ formatNumber(totalGoldUsd(expansion), '$') }}</th>
          </tr>
        </tfoot>
  
      </table>
    </div>
    <div v-if="items[expansion].length === 1 && items[expansion][0].balance == 0">
      No items found.
      <hr/>
    </div>
  </div>
</div>

<div>
  <h2>Inventory totals</h2>
  <table class="table table-hover w-100">
    <thead>
      <tr>
        <th/>
        <th class="text-start">Item</th>
        <th class="text-end">Balance</th>
        <th class="text-end">Jewel Price</th>
        <th class="text-end">Jewels</th>
        <th class="text-end">Jewel USD</th>
        <th class="text-end">Gold Price</th>
        <th class="text-end">Gold</th>
        <th class="text-end">Gold USD</th>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <th class="text-end" colspan="5">{{ formatNumber(totalJewels('sd') + totalJewels('cv') + totalJewels('sd2')) }}</th>
        <th class="text-end">{{ formatNumber(totalJewelUsd('sd') + totalJewelUsd('cv') + totalJewelUsd('sd2'), '$') }}</th>
        <th class="text-end" colspan="2">{{ formatNumber(totalGold('sd') + totalGold('cv') + totalGold('sd2')) }}</th>
        <th class="text-end">{{ formatNumber(totalGoldUsd('sd') + totalGoldUsd('cv') + totalGoldUsd('sd2'), '$') }}</th>
      </tr>
    </tfoot>
  </table>
</div>
</template>

<script>
import formatNumber from "@/utils/FormatNumber";
import SortIcon from "@/components/generic/SortIcon";
import { mappedGoldPrices, GetTokenList, getAllItemDetails } from "@/utils/Items";
import _ from 'lodash'

import {formatUnits, contractJson, RPCs} from "@/utils/ethers"
import { Contract } from 'ethers'
import axios from "axios";

const defaultSort = {
  name: 0,
  balance: 0,
  price: 0,
  totalJewel: 0,
  jewels: 0,
  priceGold: 0,
  gold: 0,
}

const excludedItems = [
  "JEWEL", "AVAX", "CRYSTAL", "CRYSTAL-AVAX", "JEWEL-AVAX", "JEWEL-CRYSTAL", "JEWEL-xJEWEL",
  "WJEWEL", "xJEWEL", "xCRYSTAL"
]



const GOLD_TOKENS = {
  "cv" : {
      "chainId": 53935,
      "address": "0x576C260513204392F0eC0bc865450872025CB1cA",
      "symbol": "DFKGOLD",
      "name": "Gold",
      "decimals": 3,
      "logoURI": "https://dfk-hv.b-cdn.net/art-assets/items/gold-bag.png",
      "tags": [
        "dfk chain"
      ]
    },
  "sd" : {
    "chainId": 1666600000,
    "address": "0x3a4EDcf3312f44EF027acfd8c21382a5259936e7",
    "symbol": "DFKGOLD",
    "name": "Gold",
    "decimals": 3,
    "logoURI": "https://dfk-hv.b-cdn.net/art-assets/items/gold-bag.png",
    "tags": [
      "harmony"
      ]
    },
  "sd2" : {
    "chainId": 8217,
    "address": "0xe7a1B580942148451E47b92e95aEB8d31B0acA37",
    "symbol": "DFKGOLD",
    "name": "Gold",
    "decimals": 3,
    "logoURI": "https://dfk-hv.b-cdn.net/art-assets/items/gold-bag.png",
    "tags": [
      "harmony"
      ]
    }
  }

export default {
  name: "PersonalInventory",
  components: {SortIcon},
  props: ["userAddress"],
  inject: ["prices", "setInventoryTotal"],
  data() {
    return {
      items: {
        'sd': [],
        'cv': [],
        'sd2': []
      },
      itemSort: {...defaultSort},
      chainIdMap : {
        53935: 'avalanchedfk',
        1666600000: 'harmony',
        8217: 'klaytn'
      },
      chainIdExpansionMap: {
        53935: 'cv',
        1666600000: 'sd',
        8217: 'sd2'
      }
    }
  },
  computed: {
    jewelPrice() {
      return this.prices()["JEWEL"]
    }
  },
  methods: {
    totalJewels(expansion) {
      let jewels = _.sumBy(this.items[expansion], "totalJewel")

      this.setInventoryTotal(jewels, expansion)
      return jewels
    },
    totalGold(expansion) {
      return _.sumBy(this.items[expansion], "totalGold")
    },
    totalJewelUsd(expansion) {
      return _.sumBy(this.items[expansion], "totalJewelUsd")
    },
    totalGoldUsd(expansion) {
      return _.sumBy(this.items[expansion], "totalGoldUsd")
    },
    sortedItems(expansion) {
      const sortOrder = this.itemSort
      const items = [...this.items[expansion]];

      if (sortOrder.balance > 0)
        items.sort((a, b) => a.balance - b.balance)
      else if (sortOrder.balance < 0)
        items.sort((a, b) => b.balance - a.balance)

      else if (sortOrder.name > 0)
        items.sort((a, b) => a.name.localeCompare(b.name))
      else if (sortOrder.name < 0)
        items.sort((a, b) => b.name.localeCompare(a.name))

      else if (sortOrder.price > 0)
        items.sort((a, b) => a.jewelPrice - b.jewelPrice)
      else if (sortOrder.price < 0)
        items.sort((a, b) => b.jewelPrice - a.jewelPrice)

      else if (sortOrder.totalJewel > 0)
        items.sort((a, b) => a.totalJewel - b.totalJewel)
      else if (sortOrder.totalJewel < 0)
        items.sort((a, b) => b.totalJewel - a.totalJewel)

      else if (sortOrder.priceGold > 0)
        items.sort((a, b) => a.goldPrice - b.goldPrice)
      else if (sortOrder.priceGold < 0)
        items.sort((a, b) => b.goldPrice - a.goldPrice)

      else if (sortOrder.gold > 0)
        items.sort((a, b) => a.totalGold - b.totalGold)
      else if (sortOrder.gold < 0)
        items.sort((a, b) => b.totalGold - a.totalGold)
      else
        items.sort((a, b) => a.name.localeCompare(b.name))
      return items;
    },
    formatNumber(num, prefix, suffix, decimals) {
      return formatNumber(num, prefix, suffix, decimals)
    },
    goldItem(expansion) {
      return this.items[expansion].find(item => item.address === GOLD_TOKENS[expansion].address);
    },
    async loadPrice(itemDetails) {
      let chainId = this.chainIdMap[itemDetails.chainId];
      const dsPrefix = "https://api.dexscreener.io/latest/dex/tokens/"
      let r = await axios.get(dsPrefix + itemDetails.address)
      if (r.status === 200) {
        let pairs = r.data.pairs?.filter(pair =>
            pair.dexId === "defikingdoms"
            && Number(pair.priceUsd) > 0
            && pair.chainId === chainId
            && pair.priceUsd
        )
        if (pairs?.length > 0){
          if(itemDetails.symbol === "DFKGOLD" && chainId === "avalanchedfk") console.log(pairs[0]) // here to try and catch intermittent bug where CV gold price get set as Infinity
          return Number(pairs[0].priceUsd)
        }
      } else {
        console.log(`Got status ${r.status} : ${r.statusText} while loading prices`)
      }
      return 0
    },
    async loadInventory() {
      const allItems = []
      // load gold first
      for(const exp in GOLD_TOKENS){
        await this.loadItem(GOLD_TOKENS[exp]);
      }
      for (let item of getAllItemDetails()) {
        if (item.symbol !== 'DFKGOLD') {
          allItems.push(this.loadItem(item))
        }
      }
      await Promise.all(allItems)
    },
    async loadItem(itemDetails) {
      let expansion = this.chainIdExpansionMap[itemDetails.chainId];

      const contract = new Contract(itemDetails.address, contractJson.erc20.abi, RPCs[expansion]);
      const balance = Number(formatUnits(await contract.balanceOf(this.userAddress), itemDetails.decimals))
      
      if (balance === 0 && itemDetails.symbol !== 'DFKGOLD')
        return
      let usdPrice = await this.loadPrice(itemDetails)
      if (excludedItems.includes(itemDetails.symbol)) {
        return
      }
      const goldPrices = mappedGoldPrices();
      itemDetails.goldPrice = itemDetails.address && goldPrices[itemDetails.symbol] ? goldPrices[itemDetails.symbol]["gold"]: 0;
      const item = {
        ...itemDetails,
        usdPrice,
        balance,
        jewelPrice: usdPrice/this.jewelPrice,
        totalGold: balance * (itemDetails.address===GOLD_TOKENS[expansion].address?1:itemDetails.goldPrice),
        totalJewel: usdPrice / this.jewelPrice * balance,
        totalGoldUsd: balance * (itemDetails.address===GOLD_TOKENS[expansion].address?1:itemDetails.goldPrice) * (itemDetails.address===GOLD_TOKENS[expansion].address?usdPrice:this.goldItem(expansion).usdPrice),
        totalJewelUsd: usdPrice * balance
      }
      this.items[expansion].push(item)
    }
  ,
    toggleSort(field) {
      let currentDir = this.itemSort[field]

      if (currentDir === 0)
        currentDir = -1

      this.itemSort = {...defaultSort}

      this.itemSort[field] = currentDir * -1
    },
    betterJewelTrade(item) {
      return item.totalJewelUsd > item.totalGoldUsd ? "Uncommon" : ""
    },
    betterGoldTrade(item) {
      return (item.totalJewelUsd < item.totalGoldUsd) ? "Uncommon" : ""
    }
  },
  provide() {
    return {
      sortToggle: (field) => this.toggleSort(field)
    }
  },
  mounted() {
    GetTokenList()
    this.loadInventory()
    this.toggleSort("name")
  }
}
</script>

<style scoped>
.Uncommon { color: #14C25A }
</style>
