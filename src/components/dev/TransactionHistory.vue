<template>
  <tr>
    <td colspan="4">
      <button v-on:click="toggleTransactions">{{ showHideTransactions }}</button>
      <div v-if="showingTransactions" class="container">
        <span v-if="transactions.length < 1">Loading...</span>
        <table class="table table-striped">
          <thead>
          <tr>
            <th>Date</th>
            <th class="text-end">
              Amount
            </th>
            <th>To address</th>
            <th>Transaction</th>
          </tr>
          </thead>
          <tbody>
          <tr :key="t" v-for="t in transactions">
            <td>{{ t.time }}</td>
            <td class="text-end">{{ t.amount }}</td>
            <td>
              <Address :address="t.to"/>
            </td>
            <td><a :href="'https://explorer.harmony.one/tx/' + t.hash" target="_blank">Explorer</a></td>
          </tr>

          </tbody>
        </table>
        <p>
          <span v-on:click="turnPage(-1)">Prev page</span>&nbsp;-&nbsp;
          <span> {{ this.pageIndex + 1 }}</span>&nbsp;-&nbsp;
          <span v-on:click="turnPage(1)">Next page</span>
        </p>
      </div>
    </td>
  </tr>
</template>

<script>
import Address from "@/components/generic/Address";
import {Client, HTTPTransport, RequestManager} from "@open-rpc/client-js";

const {Harmony} = require('@harmony-js/core');
const {
  ChainID,
  ChainType,
  hexToNumber,
  fromWei,
  Units
} = require('@harmony-js/utils');

const {AbiCoder} = require('@harmony-js/contract');

const hmy = new Harmony(
    'https://api.harmony.one/',
    {
      chainType: ChainType.Harmony,
      chainId: ChainID.HmyMainnet,
    },
);

export default {
  name: "TransactionHistory",
  props: [
    'address'
  ],
  components: {
    Address
  },
  data() {
    return {
      transactions: [],
      showingTransactions: false,
      pageIndex: 0
    }
  },
  methods: {
    toggleTransactions() {
      if (this.showingTransactions) {
        this.showingTransactions = false
        this.transactions = []
      } else {
        this.showingTransactions = true
        this.fetchTransactions()
        this.$gtag.event("ShowDevTransactions", {
          'event_category': 'DevWatch',
          'evet_label': 'LoadTransactions',
          'value': this.address
        })
      }
    },
    async fetchTransactions() {
      const transport = new HTTPTransport("https://api.harmony.one");
      const client = new Client(new RequestManager([transport]));

      const transactions = []

      const request = {
        method: "hmy_getTransactionsHistory",
        params: [{
          address: this.address,
          pageIndex: this.pageIndex,
          pageSize: 100,
          fullTx: true,
          txType: "ALL",
          order: "DESC"
        }],
      }

      const res = await client.request(request)

      console.log("result")
      console.log(res)

      for (let trans of res.transactions) {
        // await res.transactions.forEach(async trans => {
        const receipt = await hmy.blockchain.getTransactionReceipt({txnHash: trans.hash})
        console.log("receipt")
        console.log(receipt)
        receipt.result.logs.forEach(entry => {
          if (entry.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {

            const event = parseSuggestedEvent("Transfer(address,address,uint256)", entry.data, entry.topics)
            console.log("event")
            console.log(event)
            if (event.parsed.$0.toString().toLowerCase() === this.address.toLowerCase())
              transactions.push({
                hash: trans.hash,
                timestamp: hexToNumber(trans.timestamp) * 1e3,
                time: new Date(hexToNumber(trans.timestamp) * 1e3).toISOString(),
                from: event.parsed.$0,
                to: event.parsed.$1,
                amount: formatAmount(event.parsed.$2)
              })
          }
        })

      }
      // .catch(err => {console.log(err)})

      this.transactions = transactions.sort((a,b) => b.timestamp - a.timestamp)

    },
    turnPage(delta) {
      if (delta < 0 && this.pageIndex === 0)
        return

      this.pageIndex += delta
      this.transactions = []
      this.fetchTransactions()
    }
  },
  computed: {
    showHideTransactions: function () {
      if (this.showingTransactions)
        return "Hide last outgoing transfers"
      else
        return "Show last outgoing transfers"
    }
  },
  mounted() {
  }
}

function formatAmount(amt) {
  const num = (fromWei(amt, Units.one) * 1.0).toFixed(2)

  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function parseSuggestedEvent(sig, data, topics) {
  if (!sig) {
    return;
  }

  const event = parseTextSignature(sig);

  if (!event) {
    return;
  }
  const abi = createABI(event.name, event.params, "event");
  const coder = AbiCoder()

  if (abi.inputs.length) {
    try {
      const [topic0, ...restTopics] = topics;
      const parsed = coder.decodeLog(abi.inputs, data, restTopics);

      console.log(topic0)

      return {
        event,
        abi,
        parsed,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

const createABI = (name, params, type) => {
  const inputs = params.map((type, i) => ({
    name: `$${i}`,
    type,
    // todo ?
    indexed: type === "address",
  }));
  return {
    inputs,
    type,
    name,
  };
};

const parseTextSignature = (sig) => {
  try {
    const [name, ...rest] = sig.split("(");
    const params = rest.join("").split(")")[0].split(",");

    return {
      name,
      params,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

</script>

<style scoped>

</style>