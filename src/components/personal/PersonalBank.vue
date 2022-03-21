<template>
  <div class="col-lg-8 m-auto border border-dark rounded-3">
    <h3 class="p-3">Bank</h3>
    <span v-if="error.length > 0" class="bg-dark font-danger">{{ error }}</span>
    <div>
      <table class="m-auto table table-hover w-100">
        <tbody>
        <tr>
          <td class="text-start">xJewel Balance</td>
          <td class="text-end">{{ formattedUserXJewelBalance }}</td>
        </tr>
        <tr>
          <td class="text-start">Jewel Balance</td>
          <td class="text-end">{{ formattedUserJewelBalance }}</td>
        </tr>
        <tr>
          <td class="text-start">Bank ratio</td>
          <td class="text-end">{{ xJewelRatio.toFixed(4) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="progress < maxProgress"  class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated"
           role="progressbar"
           aria-valuenow="{{ progress }}"
           aria-valuemin="0"
           aria-valuemax="{{ maxProgress }}"
           :style="{width: (progress/maxProgress * 100) + '%'}">
      </div>
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
    'https://api.harmony.one', //'https://harmony-0-rpc.gateway.pokt.network', //'https://api.harmony.one',
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


const profileContractJson = require("../../data/profile.json")
const profileContractAddress = "0xabd4741948374b1f5dd5dd7599ac1f85a34cacdd"

const profileContract = hmy.contracts.createContract(profileContractJson.abi, profileContractAddress)

export default {
  name: "PersonalBank",
  props: ["userAddress"],
  data() {
    return {
      xJewelTotalSupply: 0.0,
      bankJewelBalance: 0.0,
      userXJewelBalance: 0.0,
      userBankJewelBalance: 0.0,
      error: "",
      loading: true,
      progress: 0,
      maxProgress: 3,
    }
  },
  computed: {
    xJewelRatio() {
      if (this.xJewelTotalSupply > 0 && this.bankJewelBalance > 0)
        return this.bankJewelBalance / this.xJewelTotalSupply
      else
        return 0.0
    },
    formattedUserXJewelBalance() {
      return formatNumber(this.userXJewelBalance)
    },
    formattedUserJewelBalance() {
      return formatNumber(this.userBankJewelBalance)
    }
  },
  methods: {
    loadBank() {
      Promise.all([
        xJewelContract.methods.totalSupply()
            .call()
            .then(totalSupply => {
              this.xJewelTotalSupply = totalSupply
              this.progress++
            })
            .catch(err => {
              console.log(err)
              this.error = err

            }),

        jewelContract.methods.balanceOf(xJewelContractAddress)
            .call()
            .then(balance => {
              this.bankJewelBalance = balance
              this.progress++
            })
            .catch(err => {
              console.log(err)
              this.error = err
            }),

        xJewelContract.methods.balanceOf(this.userAddress)
            .call()
            .then(balance => {
              this.userXJewelBalance = balance / 1e18
              this.progress++
            })
            .catch(err => {
              console.log(err)
              this.error = err
            })
      ])
          .then(() => {
            this.loading = false
            this.userBankJewelBalance = this.xJewelRatio * this.userXJewelBalance
            this.setBankBalance(this.userBankJewelBalance)
          })
    },
    loadProfile() {
      profileContract.methods.getProfileByAddress(this.userAddress)
          .call()
          .then(profile => {
            this.setProfileName(profile._name)
          })
    }
  },
  inject: ["setBankBalance", "setProfileName"],
  mounted() {
    this.loadBank()
    this.loadProfile()
  }
}
</script>

<style scoped>

</style>