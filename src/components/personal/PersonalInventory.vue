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
  "0x66f5bfd910cd83d3766c4b39d13730c911b2d286", // shvas rune
  "0x8F655142104478724bbC72664042EA09EBbF7B38", // moksha rune

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

  // potions
  "0x2789F04d22a845dC854145d3c289240517f2BcF0", // Health Vial
  "0x87361363A75c9A6303ce813D0B2656c34B68FF52", // Full Health Potion
  "0x19b020001AB0C12Ffa93e1FDeF90c7C37C8C71ef", // Mana Vial
  "0xDc2C698aF26Ff935cD1c50Eef3a4A933C62AF18D", // Full Mana Potion
  "0x959ba19508827d1ed2333B1b503Bd5ab006C710e", // Stamina Vial
  "0xA1f8b0E88c51a45E152934686270DDF4E3356278", // Anti-Poison potion
  "0x1771dEc8D9A29F30d82443dE0a69e7b6824e2F53", // Anti-Blinding Potion
  "0x7e120334D9AFFc0982719A4eacC045F78BF41C68", // Magic Resistance Potion
  "0xFb03c364969a0bB572Ce62b8Cd616A7DDEb4c09A", // Toughness Potion
  "0x872dD1595544CE22ad1e0174449C7ECE6F0bb01b", // Swiftness Potion

  // atonement crystals
  "0x1f3F655079b70190cb79cE5bc5AE5F19dAf2A6Cf", // Lesser Atonement Crystal
  "0x27dC6AaaD95580EdF25F8B9676f1B984e09e413d", // Atonement Crystal
  "0x17f3B5240C4A71a3BBF379710f6fA66B9b51f224", // Greater Atonement Crystal

  // attunement crystals
  "0xaB464901AFBc61bAC440a97Fa568aC42885Da58B", // Lesser Might Crystal
  "0xb368f69bE6eDa74700763672AEB2Ae63f3d20AE6", // Might Crystal
  "0x39927A2CEE5580d63A163bc402946C7600300373", // Lesser Finesse Crystal
  "0xc6A58eFc320A7aFDB1cD662eaf6de10Ee17103F2", // Finesse Crystal
  "0xf5c26F2F34E9245C3A9ea0B0e7Ea7B33E6404Da0", // Lesser Swiftness Crystal
  "0x5d7f20e3B0f1406Bf038175218eA7e9B4838908c", // Swiftness Crystal
  "0x0d8403E47445DB9E316E36F476dacD5827220Bdd", // Lesser Vigor Crystal
  "0xBbA50bD111DC586Fd1f2B1476B6eC505800A3FD0", // Vigor Crystal
  "0x3017609B9A59B77B708D783835B6fF94a3D9E337", // Lesser Fortitude Crystal
  "0x603919AEB55EB13F9CDE94274fC54ab2Bd2DecE7", // Fortitude Crystal
  "0x17ff2016c9ecCFBF4Fc4DA6EF95Fe646D2c9104F", // Lesser Wit Crystal
  "0x3619fc2386FbBC19DDC39d29A72457e758CFAD69", // Wit Crystal
  "0xc63b76f710e9973b8989678eb16234CfADc8D9DB", // Lesser Insight Crystal
  "0x117E60775584CdfA4f414E22b075F31cC9c3207C", // Insight Crystal
  "0x13AF184aEA970Fe79E3BB7A1B0B156B195fB1f40", // Lesser Fortune Crystal
  "0x6D777C64f0320d8A5b31BE0FdeB694007Fc3ed45", // Fortune Crystal
  "0xa509c34306AdF6168268A213Cc47D336630bf101", // Lesser Chaos Crystal
  "0x45B53E55b5c0A10fdd4fE2079a562d5702F3A033", // Chaos Crystal

  // enhancement stones
  "0xe4E7C0c693d8A7FC159776a993495378705464A7", // Lesser Might Stone
  "0xE7F6ea1cE7BbEbC9F2Cf080010dd938d2D8D8B1b", // Might Stone
  "0xbb5614D466b77d50DdEd994892DFe6F0ACA4eEbb", // Lesser Finesse Stone
  "0xD0B689Cb5DE0c15792Aa456C89D64038C1F2EedC", // Finesse Stone
  "0xd9A8abC0Ce1ADC23F1c1813986c9a9C21C9e7510", // Lesser Swiftness Stone
  "0x08f362517aD4119d93bBCd20825c2E4119abB495", // Swiftness Stone
  "0xB00CbF5Cd5e7b321436C2D3d8078773522D2F073", // Lesser Vigor Stone
  "0x9df75917aC9747B4A70fa033E4b0182d85B62857", // Vigor Stone
  "0x1f57eb682377f5Ad6276b9315412920BdF9530f6", // Lesser Fortitude Stone
  "0x17Fa96ba9d9C29e4B96d29A7e89a4E7B240E3343", // Fortitude Stone
  "0x4Ff7A020ec1100D36d5C81F3D4815F2e9C704b59", // Lesser Wit Stone
  "0x939Ea05C81aAC48F7C10BdB08615082B82C80c63", // Wit Stone
  "0x762b98B3758d0A5Eb95B3E4A1E2914Ce0A80D99c", // Lesser Insight Stone
  "0x9D71Bb9C781FC2eBdD3d6cb709438e3c71200149", // Insight Stone
  "0x6D6eA1D2Dc1Df6Eaa2153f212d25Cf92d13Be628", // Lesser Fortune Stone
  "0x5da2EffE9857DcEcB786E13566Ff37B92e1E6862", // Fortune Stone
  "0x6D4f4bC32df561a35C05866051CbE9C92759Da29", // Lesser Chaos Stone
  "0x3633F956410163A98D58D2D928B38C64A488654e", // Chaos Stone
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

      // console.info(prices)

      for (let item of this.items) {
        // console.info(item.address.toLowerCase() +  prices[item.address.toLowerCase()])
        item.price = prices[item.address.toLowerCase()]
        item.jewels =  item.price * item.balance
        if(!isNaN(item.jewels))
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
      // console.info(this.itemSort)
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
