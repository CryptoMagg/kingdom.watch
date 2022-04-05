<template>
  <div class="container">
    <h3>Bank APR<template v-if="avgAPR.apr > 0">: {{ avgAPR.apr }}%</template></h3>
    <p v-if="avgAPR.apr > 0"><em>This is the average APR between {{ avgAPR.start }} and {{ avgAPR.end }}</em></p>
    <p class="text-warning bg-dark" v-if="computedHistory.length < 1">Loading bank data from history..</p>
    <table class="table table-striped">
      <thead>
      <tr>
        <th class="text-start">Date</th>
        <th class="text-end">xJewels</th>
        <th class="text-end">Balance (Jewels)</th>
        <th class="text-end">Change</th>
        <th class="text-end">Ratio</th>
        <th class="text-end">Change</th>
        <th class="text-end">Change %</th>
        <th class="text-end">APR</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="hist in computedHistory" :key="hist">
        <td class="text-start">{{ hist.date }}</td>
        <td class="text-end">
          <span v-if="!!hist.xJewels">{{ hist.xJewels }}</span>
        </td>
        <td class="text-end">
          <span v-if="!!hist.balance">{{ hist.balance }}</span>
        </td>
        <td class="text-end">
          <span v-if="!!hist.balance">{{ hist.balanceChange }}</span>
        </td>
        <td class="text-end">{{ hist.ratio.toFixed(5) }}</td>
        <td class="text-end">
          <span v-if="!!hist.delta">{{ hist.delta.toFixed(6) }}</span
          ></td>
        <td class="text-end">
          <span v-if="!!hist.percent">{{ hist.percent.toFixed(5) }}</span>
        </td>
        <td class="text-end">
          <span v-if="!!hist.apr">{{ hist.apr.toFixed(2) }}</span>
        </td>
      </tr>
      </tbody>
    </table>
    <pre class="text-start">
      The APR is calculated as shown here:

      ratioChange = entry.ratio - prevEntry.ratio
      percent = (ratioChange / prevEntry.ratio) * 100.0
      apr = percent / ((entry.timestamp - prevEntry.timestamp) / (365 * 24 * 60 * 60 * 1000))

      The timestamps are in milliseconds.
    </pre>
  </div>
</template>

<script>
function formatNumber(num) {
  if (!isNaN(num) && !!num)
    return num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  else
    return null
}

import axios from 'axios'
import {computed, ref} from 'vue'

export default {
  name: "BankWatch",
  components: {},
  setup() {
    const data = ref([1, 2, 3])
    const chartData = computed(() => {
      return {
        series: [{
          name: 'Test Series',
          data: data.value,
        }],
      }
    });
    const onRender = () => {
      console.log('Chart rendered');
    };
    return {
      chartData,
      onRender
    };
  },
  data() {
    return {
      history: [],
      fetched: false,
    }
  },
  methods: {
    fetchHistory() {
      axios.get("https://us-east1-dfkwatch-328521.cloudfunctions.net/xJewelRatioHistory") // "http://localhost:7000") //
          .then(response => {
            this.history = response.data.reverse()
            this.fetched = true
          })
          .catch(err => console.log(err))
    }
  },
  computed: {
    computedHistory() {
      let prevEntry = null
      let ratioChange = 0.0
      let percent = 0.0
      let apr = 0.0
      let balanceDeltaString = ""
      let xJewels = 0.0
      const history = []

      for (let entry of this.history) {
        if (prevEntry) {
          ratioChange = entry.ratio - prevEntry.ratio
          percent = (ratioChange / prevEntry.ratio) * 100.0
          apr = percent / ((entry.timestamp - prevEntry.timestamp) / (365 * 24 * 60 * 60 * 1000))

          if (!isNaN(prevEntry.balance)) {
            const balanceDelta = entry.balance - prevEntry.balance
            if (balanceDelta > 0)
              balanceDeltaString = "+" + formatNumber(balanceDelta)
            else
              balanceDeltaString = formatNumber(balanceDelta)
          }

        }
        if (!isNaN(entry.totalSupply))
          xJewels = formatNumber(entry.totalSupply)

        const date = new Date(entry.timestamp * 1).toISOString()
        const balance = formatNumber(entry.balance * 1.0)

        history.push({
          date: date,
          xJewels: xJewels,
          balance: balance,
          balanceChange: balanceDeltaString,
          ratio: entry.ratio,
          delta: ratioChange,
          percent: percent,
          apr: apr
        })

        prevEntry = entry
      }

      return history.reverse()
    },
    avgAPR() {
      if (this.history.length < 2)
        return 0.0
      const first = this.history[0]
      const last = this.history[this.history.length - 1]

      if (!first || !last)
        return 0.0

      const delta = first.ratio - last.ratio
      const percent = (delta / last.ratio) * 100.0
      const apr = percent / ((first.timestamp - last.timestamp) / (365 * 24 * 60 * 60 * 1000))

      const start = new Date(first.timestamp).toISOString()
      const end = new Date(last.timestamp).toISOString()

      return {
        start: start,
        end: end,
        apr: apr.toFixed(2)
      }
    }
  },
  mounted() {
    this.fetchHistory()
  }
}
</script>

<style scoped>

</style>