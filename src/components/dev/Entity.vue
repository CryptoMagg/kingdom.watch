<template>

  <tr>
    <td class="text-start"><Address :address="this.address" /></td>
    <td class="text-end">
      <img style="width: 16px"
           alt="jewel"
          :src="require('@/assets/dfk/JEWEL.png')">
      {{ balance }}
    </td>
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

const {ContractFactory} = require('@harmony-js/contract');
const {Wallet} = require('@harmony-js/account');
const {Messenger, HttpProvider} = require('@harmony-js/network');
const {ChainID, ChainType, Units, fromWei} = require('@harmony-js/utils');

const wallet = new Wallet(new Messenger(
    new HttpProvider('https://api.harmony.one'),
    ChainType.Harmony,
    ChainID.HmyMainnet
));

const factory = new ContractFactory(wallet);

const JewelContractJson = require("../../data/Jewel.json");
const JewelContract = factory.createContract(JewelContractJson.abi, "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F");
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
      explorerLink: "https://explorer.harmony.one/address/" + this.address,
      balance: -1.0,
    }
  },
  methods: {
    fetchBalance() {
      JewelContract.methods
          .balanceOf(this.address)
          .call()
          .then(rawbal => {
            const bal = formatNumber((fromWei(rawbal, Units.one) * 1.0).toFixed(2))
            console.log(this.tokenName + ' balance: ' + bal);
            this.balance = bal
          })
          .catch(err => {
            console.log(err)
          })
    },
    fetchTransactions() {
      const transport = new HTTPTransport("https://api.harmony.one");
      const client = new Client(new RequestManager([transport]));

      const request = {
        method: "hmy_getTransactionsHistory",
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