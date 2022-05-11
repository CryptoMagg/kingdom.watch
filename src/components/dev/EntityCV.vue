<template>

  <tr>
    <td class="text-start"><Address :address="this.address" /></td>
    <td class="text-end">
      <img style="width: 16px"
           alt="jewel"
          :src="require('@/assets/dfk/crystal-logo.b0ad245d.png')">
      {{ balance }}
    </td>
    <td class="text-end">
      <img style="width: 16px"
           alt="jewel"
           :src="require('@/assets/dfk/crystal-logo.b0ad245d.png')">
      {{ lockedBalance }}</td>
    <td class="text-start"><em>{{ this.desc }}</em></td>
    <td>
      <a :href="explorerLink" target="_blank">Explorer</a>
    </td>
  </tr>
</template>

<script>
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

import {Client, HTTPTransport, RequestManager} from "@open-rpc/client-js";

// const Web3 = require('web3');
// const web3 = new Web3("https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc")

const Contract = require('web3-eth-contract');
Contract.setProvider('https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc');
const crystalTokenAbi = require("../../data/CrystalToken.json")
const crystalContract = new Contract(crystalTokenAbi, "0x04b9dA42306B023f3572e106B11D82aAd9D32EBb");

import Address from "@/components/generic/Address";

export default {
  name: "Entity",
  components: {
    Address
  },
  props: [
    'address',
    'desc'
  ],
  data() {
    return {
      explorerLink: "https://subnets.avax.network/defi-kingdoms/dfk-chain/explorer/address/" + this.address,
      balance: -1.0,
      lockedBalance: -1.0,
    }
  },
  methods: {
    fetchBalance() {
      crystalContract.methods
          .balanceOf(this.address)
          .call()
          .then(rawbal => {
            const bal = formatNumber(((rawbal / 1e18) * 1.0).toFixed(2))
            console.log(this.tokenName + ' balance: ' + bal);
            this.balance = bal
          })
          .catch(err => {
            console.log(err)
          })

      crystalContract.methods
          .lockOf(this.address)
          .call()
          .then(rawbal => {
            const bal = formatNumber(((rawbal / 1e18) * 1.0).toFixed(2))
            console.log(this.tokenName + ' balance: ' + bal);
            this.lockedBalance = bal
          })
          .catch(err => {
            console.log(err)
          })



    },
    fetchTransactions() {
      const transport = new HTTPTransport("https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc");
      const client = new Client(new RequestManager([transport]));

      const request = {
        method: "getTransactionsHistory",
        params: [{
          address: this.address,
          pageIndex: 0,
          pageSize: 10,
          fullTx: false,
          txType: "ALL",
          order: "DESC"
        }],
      }

      client.request(request)
          .then(res => {
            console.log("result")
            console.log(res)
            this.transactions = res.transactions
          })


    }

  },
  mounted() {
    this.fetchBalance()
  }
}
</script>

<style scoped>

</style>
