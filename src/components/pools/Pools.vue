<template>
  <div class="container-sm" style="max-width: 500px">
    <!--    Gardens: {{ poolCount }}<br />-->
    <!--    Total Alloc: {{ totalAllocPoints }}<br />-->
    <!--    Rewards per block: {{ rewardPerBlock }}<br />-->
    <!--    Current multiplier: {{ currentMultiplier }}<br />-->
    <!--    Rewards per day: {{ rewardsPerDay }}<br />-->

<!--    <div class="row text-warning bg-dark text-start">-->
<!--      Harmony RPC is overloaded, experimenting with backup RPC.<br/>-->
<!--      Loading may take up to 60 seconds or even more.<br/>-->
<!--      Please report problems to Magg in DFK Discord-->
<!--    </div>-->


    <div class="row">
      Please paste your address in the box below, and click load
      <input type="text" placeholder="Your address" v-on:input="setUserAddress" :value="userAddress">
      <button v-on:click="load()">{{ loadingStatus }}</button>
    </div>

    <div class="text-start row p-1" v-if="status.length > 0">
      <em>{{ status }} for <span class="font-monospace">{{ userAddress }}</span></em>
    </div>

    <div class="row text-start p-1" v-if="epoch.epoch > 0">
      Block number {{ blockNumber }} means the current epoch is {{ epoch.epoch }}, with a multiplier of
      {{ epoch.multiplier }}x and unlock rate of {{ epoch.unlock }}%.
    </div>

    <div class="row text-start p-1" v-if="!!prices['JEWEL']">Jewel price: ${{ prices["JEWEL"].toFixed(2) }}</div>

    <div class="text-warning bg-dark">
      Please consider using the new Personal page! It has all this info and more! You can find it <router-link to="/personal">here</router-link>, and even bookmark your personal address!
      <router-link to="/personal">Personal Watch</router-link>
    </div>

    <div class="row text-start">
      <table>
        <template v-if="pendingUnlocked > 0 || currentlyLocked > 0">
          <tr class="text-light bg-dark">
            <td colspan="3">Jewel status</td>
          </tr>
          <tr>
            <td>Currently locked</td>
            <td>{{ currentlyLocked.toFixed(2) }}</td>
            <td>${{ (currentlyLocked * prices["JEWEL"]).toFixed(2) }}</td>
          </tr>
          <tr>
            <td>Currently in wallet</td>
            <td>{{ currentlyUnlocked.toFixed(2) }}</td>
            <td>${{ (currentlyUnlocked * prices["JEWEL"]).toFixed(2) }}</td>
          </tr>
          <tr>
            <td>Pending locked</td>
            <td>{{ pendingLocked.toFixed(2) }}</td>
            <td>${{ (pendingLocked * prices["JEWEL"]).toFixed(2) }}</td>
          </tr>
          <tr>
            <td>Pending unlocked</td>
            <td>{{ pendingUnlocked.toFixed(2) }}</td>
            <td>${{ (pendingUnlocked * prices["JEWEL"]).toFixed(2) }}</td>
          </tr>
          <tr>
            <td>Pending unlocked next epoch ({{ nextEpochInDays.toFixed(1) }} days)</td>
            <td>{{ pendingUnlockedNextEpoch.toFixed(2) }}</td>
            <td>${{ (pendingUnlockedNextEpoch * prices["JEWEL"]).toFixed(2) }}</td>
          </tr>
        </template>

        <template v-if="bankBalanceXjewels > 0" class="container border text-start">
          <tr class="text-light bg-dark">
            <td colspan="3">Bank balance</td>
          </tr>
          <tr>
            <td>xJewels</td>
            <td>{{ bankBalanceXjewels.toFixed(2) }}</td>
            <td></td>
          </tr>
          <tr>
            <td>Jewels</td>
            <td>{{ bankBalanceJewels.toFixed(2) }}</td>
            <td>${{ (bankBalanceJewels * prices["JEWEL"]).toFixed(2) }}</td>
          </tr>
          <tr>
            <td>Current ratio</td>
            <td>{{ bankRatio.toFixed(4) }}</td>
            <td></td>
          </tr>
        </template>

        <tr class="text-light bg-dark" v-if="status === 'Loading Gardens'">
          <td colspan="3">Loading Gardens...</td>
        </tr>

        <template v-for="gardenInfo in displayGardens" v-bind:key="gardenInfo">
          <Garden :garden-info="gardenInfo" :prices="prices" :epoch="epoch"/>
        </template>
      </table>
    </div>

    <div class="row p-3">
      <PriceInfo :price-data="priceData" v-if="!!prices['JEWEL']"/>
    </div>
  </div>
</template>

<script>
const priceCacheMaxAge = 60 * 1000

import axios from "axios";
import epochs from '../../data/Epochs'
import Garden from "@/components/pools/Garden";
import PriceInfo from "@/components/generic/PriceInfo";

const {Harmony} = require('@harmony-js/core');
const {
  ChainID,
  ChainType,
  hexToNumber
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

const xJewelContractJson = require("../../data/xJewel.json");
const xJewelContractAddress = "0xa9ce83507d872c5e1273e745abcfda849daa654f";

const xJewelContract = hmy.contracts.createContract(xJewelContractJson.abi, xJewelContractAddress);

const gardenerContractJson = require("../../data/MasterGardener.json");
const gardenerlContractAddress = "0xdb30643c71ac9e2122ca0341ed77d09d5f99f924";

const gardenerContract = hmy.contracts.createContract(gardenerContractJson.abi, gardenerlContractAddress);

const uniContractJson = require("../../data/UniSwap.json")
const erc20ContractJson = require("../../data/ERC20.json")

export default {
  name: "Pools",
  components: {
    Garden,
    PriceInfo
  },
  data() {
    return {
      userAddress: "",
      loading: false,
      loadingStatus: "Load",
      govToken: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
      displayGardens: [],
      userInfos: {},
      userPools: [],
      blockNumber: -1,
      currentMultiplier: -1,
      rewardPerBlock: -1,
      rewardsPerDay: -1,
      totalAllocPoints: -1,
      poolCount: -1,
      poolInfos: {},
      prices: {JEWEL: 0.0},
      priceData: {},
      pricesTimestamp: 0,
      tokens: {},
      status: "",
      bankBalanceXjewels: 0.0,
      bankBalanceJewels: 0.0,
      bankRatio: 0.0,
      epoch: {},
      nextEpoch: {},
      nextEpochInDays: 0.0,
      pendingUnlocked: 0.0,
      pendingLocked: 0.0,
      currentlyLocked: 0.0,
      currentlyUnlocked: 0.0,
      pendingUnlockedNextEpoch: 0.0,
    }
  },
  methods: {
    setUserAddress(event) {
      this.userAddress = event.target.value
    },
    async load() {
      if (this.loading) {
        console.log("Already loading")
        return
      }

      this.loading = true
      this.loadingStatus = "Loading.."
      this.reset()

      await this.loadPrices()

      this.status = "Loading Bank"
      await this.loadBank()

      this.status = "Loading Gardens"
      await this.loadGardens()
      this.$gtag.event("LoadPools")
      this.loading = false
      this.loadingStatus = "Load"
    },
    reset() {
      this.displayGardens = []
      this.userInfos = {}
      this.userPools = []
      this.poolInfos = {}
      this.epoch = {}
      this.bankBalanceXjewels = 0.0
      this.bankBalanceJewels = 0.0
      this.pendingLocked = 0.0
      this.pendingUnlocked = 0.0
      this.pendingUnlockedNextEpoch = 0.0
      this.currentlyLocked = 0.0
      this.currentlyUnlocked = 0.0
    },
    async loadPrices() {
      if (this.pricesTimestamp + priceCacheMaxAge > Date.now()) {
        console.log("Prices still up to date")
        return
      }


      return axios.get("https://us-east1-dfkwatch-328521.cloudfunctions.net/getPrices")
          .then(response => {
            if (response.status === 200) {
              this.priceData = response.data
              this.prices = response.data["prices"]
              this.pricesTimestamp = Date.now()
            } else {
              console.log(`Got status ${response.status} : ${response.statusText} while loading prices`)
            }
          })
          .catch(err => {
            console.log(`Got ${err} while loading prices`)
          })
    },
    async loadBank() {
      const xJewelTotalSupply = await xJewelContract.methods.totalSupply()
          .call()

      const bankBalance = await jewelContract.methods.balanceOf(xJewelContractAddress)
          .call()

      this.bankRatio = bankBalance / xJewelTotalSupply

      this.bankBalanceXjewels = (await xJewelContract.methods.balanceOf(this.userAddress).call()) / 1e18
      this.bankBalanceJewels = this.bankBalanceXjewels * this.bankRatio

      this.currentlyLocked = (await jewelContract.methods.lockOf(this.userAddress).call()) / 1e18
      this.currentlyUnlocked = (await jewelContract.methods.balanceOf(this.userAddress).call()) / 1e18
    },
    async loadGardens() {
      // this.prices = await prices.getHarmonyPrices()
      // console.log("prices")
      // console.log(this.prices)

      this.blockNumber = hexToNumber((await hmy.blockchain.getBlockNumber()).result)
      this.epoch = epochs.getCurrentEpoch(this.blockNumber)
      this.nextEpoch = epochs.epochData(this.epoch["epoch"] + 1)
      this.nextEpochInDays = epochs.secondsLeftUntilEpoch(this.blockNumber, this.epoch["epoch"] + 1) / 86400

      this.poolCount = await gardenerContract.methods.poolLength().call()
      this.totalAllocPoints = await gardenerContract.methods.totalAllocPoint().call()

      this.rewardPerBlock = (await gardenerContract.methods.REWARD_PER_BLOCK().call()) / 1e18

      this.rewardsPerDay = this.rewardPerBlock * this.epoch.multiplier * 86400 / 2

      for (let i = 0; i < this.poolCount; i++) {
        const userInfo = await gardenerContract.methods.userInfo(i, this.userAddress).call()

        if (userInfo.amount > 0) {
          this.userInfos[i] = userInfo
          this.userPools.push(i)
        }
      }

      const gardenPromises = []
      for (let i of this.userPools) {
        this.poolInfos[i] = await gardenerContract.methods.poolInfo(i).call()

        gardenPromises.push(this.processGarden(i))
      }

      await Promise.all(gardenPromises)

      this.status = "Finished loading bank and pools"
    },
    async processGarden(poolId) {

      const poolInfo = this.poolInfos[poolId]
      const userInfo = this.userInfos[poolId]

      console.log(`${poolInfo} ${userInfo}`)

      const gardenInfo = {}

      gardenInfo["rewardPerDay"] = poolInfo.allocPoint / this.totalAllocPoints * this.rewardsPerDay
      gardenInfo["allocPoints"] = poolInfo.allocPoint


      const poolContract = hmy.contracts.createContract(uniContractJson.abi, poolInfo.lpToken)

      const reserves = await poolContract.methods.getReserves().call()

      gardenInfo["q0"] = reserves._reserve0
      gardenInfo["q1"] = reserves._reserve1

      gardenInfo["token0"] = await poolContract.methods.token0().call()
      gardenInfo["token1"] = await poolContract.methods.token1().call()
      gardenInfo["tokens"] = [
        await this.getErc20Token(gardenInfo["token0"], poolInfo.lpToken),
        await this.getErc20Token(gardenInfo["token1"], poolInfo.lpToken),
      ]

      // TODO Fix decimals
      const decimals = 18 // await poolContract.decimals().call()

      gardenInfo["totalSupply"] = (await poolContract.methods.totalSupply().call()) / 10 ** decimals
      gardenInfo["symbol"] = await poolContract.methods.symbol().call()
      gardenInfo["name"] = await poolContract.methods.name().call() / 10 ** decimals

      gardenInfo["userStaked"] = userInfo.amount / 10 ** decimals
      gardenInfo["userShare"] = gardenInfo["userStaked"] / gardenInfo["totalSupply"]

      gardenInfo["pendingRewards"] = (await gardenerContract.methods.pendingReward(poolId, this.userAddress).call()) / 1e18

      this.pendingLocked += gardenInfo["pendingRewards"] * (100 - this.epoch.unlock) / 100
      this.pendingUnlocked += gardenInfo["pendingRewards"] * this.epoch.unlock / 100
      this.pendingUnlockedNextEpoch += gardenInfo["pendingRewards"] * this.nextEpoch.unlock / 100

      const ilData = await this.getImpermanentLoss(poolId)

      if (ilData) {
        gardenInfo["impermanentLoss"] = [
          ilData[0].current - ilData[0].deposited,
          ilData[1].current - ilData[1].deposited
        ]
      } else {
        gardenInfo["impermanentLoss"] = [0, 0]
      }
      console.log(gardenInfo["impermanentLoss"])

      console.log(gardenInfo)
      this.displayGardens.push(gardenInfo)

      //prices.poolPrices()
    },
    async getErc20Token(tokenAddress, poolAddress) {
      const erc20Contract = hmy.contracts.createContract(erc20ContractJson.abi, tokenAddress)

      const tokenInfo = {}

      tokenInfo["name"] = await erc20Contract.methods.name().call()
      tokenInfo["symbol"] = await erc20Contract.methods.symbol().call()
      tokenInfo["decimals"] = await erc20Contract.methods.decimals().call()

      // TODO Fix decimals
      tokenInfo["totalStaked"] = (await erc20Contract.methods.balanceOf(poolAddress).call()) / 10 ** 18 //tokenInfo["decimals"]

      return tokenInfo
    },
    async getImpermanentLoss(poolId) {
      console.log(`Not getting IL for pool ${poolId}`)
      if(this.userAddress.toLocaleLowerCase() !== "0xBBCB61eE75b4F6660a34f5059727FD1549C35576".toLocaleLowerCase())
        return null
      return axios.get(`https://us-east1-dfkwatch-328521.cloudfunctions.net/getPoolInfo?poolId=${poolId}&userAddress=${this.userAddress}`)
          .then(response => {
            return response.data
          })
          .catch(err => {
            console.log(err)
            return null
          })
    }
  },
  created() {
    this.loadPrices()
    if (this.$route.params.userAddress) {
      this.userAddress = this.$route.params.userAddress
      this.load()
    }
  }

}
</script>

<style scoped>

</style>