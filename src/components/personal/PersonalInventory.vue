<template>
  <div>
    <table class="table table-hover w-100">
      <thead>
      <tr>
        <th/>
        <th class="text-start">
          Item
          <SortIcon field="name"/>
        </th>
        <th class="text-end">
          Balance
          <SortIcon field="balance"/>
        </th>
        <th class="text-end">
          Jewel Price
          <SortIcon field="price"/>
        </th>
        <th class="text-end">
          Jewels
          <SortIcon field="jewels"/>
        </th>
        <th class="text-end">Jewel USD</th>
        <th class="text-end">
          Gold Price
          <SortIcon field="priceGold"/>
        </th>
        <th class="text-end">
          Gold
          <SortIcon field="gold"/>
        </th>
        <th class="text-end">Gold USD</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in sortedItems" :key="item">
        <td><img height="25" width="25" :src="item.logoURI" :alt="item.name" /></td>
        <td class="text-start">{{ item.name }}</td>
        <td class="text-end">{{ item.balance }}</td>
        <td class="text-end">{{ formatNumber(item.price) }}</td>
        <td class="text-end">{{ formatNumber(item.jewels) }}</td>
        <td class="text-end">{{ formatNumber(item.jewels * prices()["JEWEL"], '$') }}</td>
        <td class="text-end"><span v-if="item.goldPrice">{{ formatNumber(item.goldPrice) }}</span></td>
        <td class="text-end"><span v-if="item.goldPrice">{{ formatNumber(item.goldPrice * item.balance) }}</span></td>
        <td class="text-end"><span v-if="item.goldPrice">{{
            formatNumber(item.goldPrice * item.balance * prices()["0x3a4edcf3312f44ef027acfd8c21382a5259936e7"] * prices()["JEWEL"], '$')
          }}</span></td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <th/>
        <th class="text-start"></th>
        <th class="text-end"></th>
        <th class="text-end"></th>
        <th class="text-end">{{ formatNumber(totalJewels) }}</th>
        <th class="text-end">{{ formatNumber(totalUsd, '$') }}</th>
        <th/>
        <th class="text-end">{{ formatNumber(totalGold) }}</th>
        <th class="text-end">{{ formatNumber(totalUsdGold, '$') }}</th>
      </tr>
      </tfoot>

    </table>
  </div>
</template>

<script>
import formatNumber from "@/utils/FormatNumber";
import SortIcon from "@/components/generic/SortIcon";
import {getItem} from "@/utils/Items";

const {Harmony} = require('@harmony-js/core');
const {
  ChainID,
  ChainType,
} = require('@harmony-js/utils');

const erc20ContractJson = require("../../data/ERC20.json")

const hmy = new Harmony(
    'https://harmony-0-rpc.gateway.pokt.network', //https://api.harmony.one',
    {
      chainType: ChainType.Harmony,
      chainId: ChainID.HmyMainnet,
    },
);

const inventoryItemAddresses = [

  // plants
  "0x6e1bc01cc52d165b357c42042cf608159a2b81c1",
  "0x68ea4640c5ce6cc0c9a1f17b7b882cb1cbeaccd7",
  "0x600541ad6ce0a8b5dae68f086d46361534d20e80",
  "0x043f9bd9bb17dfc90de3d416422695dd8fa44486",
  "0x094243dfabfbb3e6f71814618ace53f07362a84c",
  "0x6b10ad6e3b99090de20bf9f95f960addc35ef3e2",
  "0xcdffe898e687e941b124dfb7d24983266492ef1d",

  // fish
  "0x78aed65a2cc40c7d8b0df1554da60b38ad351432",
  "0xe4cfee5bf05cef3418da74cfb89727d8e4fee9fa",
  "0x8bf4a0888451c6b5412bcad3d9da3dcf5c6ca7be",
  "0xc5891912718ccffcc9732d1942ccd98d5934c2e1",
  "0xb80a07e13240c31ec6dc0b5d72af79d461da3a70",
  "0x372caf681353758f985597a35266f7b330a2a44d",
  "0x2493cfdacc0f9c07240b5b1c4be08c62b8eeff69",

  // gardening
  "0xac5c49ff7e813de1947dc74bbb1720c353079ac9", // blue stem
  "0xc0214b37fcd01511e6283af5423cf24c96bb9808", // milkweed
  "0x19b9f05cde7a61ab7aae5b0ed91aa62ff51cf881", // spiderfruit

  // runes
  "0x66f5bfd910cd83d3766c4b39d13730c911b2d286", // shvas

  // pet eggs
  "0x9678518e04fe02fb30b55e2d0e554e26306d0892", // blue
  "0x95d02c1dc58f05a015275eb49e107137d9ee81dc", // grey
  "0x6d605303e9ac53c59a3da1ece36c9660c7a71da5", // green
  "0x9edb3da18be4b03857f3d39f83e5c6aad67bc148", // golden
  "0x3db1fd0ad479a46216919758144fd15a21c3e93c", // yellow

  // gaia's tears
  "0x24ea0d436d3c2602fbfefbe6a16bbc304c963d04",

  // gold
  "0x3a4edcf3312f44ef027acfd8c21382a5259936e7",

]

const defaultSort = {
  name: 0,
  balance: 0,
  price: 0,
  jewels: 0,
  priceGold: 0,
  gold: 0,
}

const excludedItems = {}
excludedItems["0xA9cE83507D872C5e1273E745aBcfDa849DAA654F".toLowerCase()] = true
excludedItems["0x72Cb10C6bfA5624dD07Ef608027E366bd690048F".toLowerCase()] = true


export default {
  name: "PersonalInventory",
  components: {SortIcon},
  props: ["userAddress"],
  inject: ["prices", "setInventoryTotal"],
  data() {
    return {
      items: [],
      itemSort: {...defaultSort}
    }
  },
  computed: {
    sortedItems() {
      const sortOrder = this.itemSort
      const items = [...this.items]

      if (sortOrder.balance > 0)
        items.sort((a, b) => a.balance - b.balance)
      else if (sortOrder.balance < 0)
        items.sort((a, b) => b.balance - a.balance)

      else if (sortOrder.name > 0)
        items.sort((a, b) => a.name.localeCompare(b.name))
      else if (sortOrder.name < 0)
        items.sort((a, b) => b.name.localeCompare(a.name))

      else if (sortOrder.price > 0)
        items.sort((a, b) => a.price - b.price)
      else if (sortOrder.price < 0)
        items.sort((a, b) => b.price - a.price)

      else if (sortOrder.jewels > 0)
        items.sort((a, b) => a.jewels - b.jewels)
      else if (sortOrder.jewels < 0)
        items.sort((a, b) => b.jewels - a.jewels)

      else if (sortOrder.priceGold > 0)
        items.sort((a, b) => a.goldPrice - b.goldPrice)
      else if (sortOrder.priceGold < 0)
        items.sort((a, b) => b.goldPrice - a.goldPrice)

      else if (sortOrder.gold > 0)
        items.sort((a, b) => a.gold - b.gold)
      else if (sortOrder.gold < 0)
        items.sort((a, b) => b.gold - a.gold)

      else
        items.sort((a, b) => a.name.localeCompare(b.name))


      return items
    },
    totalJewels() {
      const prices = this.prices()
      let jewels = 0

      console.info(prices)

      for (let item of this.items) {
        console.info(item.address.toLowerCase() +  prices[item.address.toLowerCase()])
        item.price = prices[item.address.toLowerCase()]
        item.jewels =  item.price * item.balance
        jewels += item.jewels
      }

      this.setInventoryTotal(jewels)
      return jewels
    },
    totalGold() {
      let gold = 0

      for (let item of this.items) {
        item.gold = item.balance * item.goldPrice
        gold += item.gold
      }

      return gold
    },
    totalUsd() {
      const prices = this.prices()

      return this.totalJewels * prices["JEWEL"]
    },
    totalUsdGold() {
      const prices = this.prices()

      return this.totalGold * prices["0x3a4edcf3312f44ef027acfd8c21382a5259936e7"] * prices["JEWEL"]

    }
  },
  methods: {
    formatNumber(num, prefix, suffix, decimals) {
      return formatNumber(num, prefix, suffix, decimals)
    },
    async loadInventory() {
      const allItems = []

      for (let itemAddress of inventoryItemAddresses)
        allItems.push(this.loadItem(itemAddress.toLowerCase()))

      await Promise.all(allItems)

    },
    async loadItem(itemAddress) {
      const erc20Contract = hmy.contracts.createContract(erc20ContractJson.abi, itemAddress)
      const erc20Decimals = await erc20Contract.methods.decimals().call()

      const balance = (await erc20Contract.methods.balanceOf(this.userAddress).call()) / 10 ** erc20Decimals
      if (balance === 0)
        return

      const item = {
        ...getItem(itemAddress),
        balance,
      }

      this.items.push(item)
    },
    toggleSort(field) {
      let currentDir = this.itemSort[field]

      if (currentDir === 0)
        currentDir = -1

      this.itemSort = {...defaultSort}

      this.itemSort[field] = currentDir * -1
      console.info(this.itemSort)
    }
  },
  provide() {
    return {
      sortToggle: (field) => this.toggleSort(field)
    }
  },
  mounted() {
    this.loadInventory()
    this.toggleSort("name")
  }
}
</script>

<style scoped>

</style>
