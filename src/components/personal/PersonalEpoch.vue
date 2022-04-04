<template>
  <div class="col-lg-8 m-auto border border-dark rounded-3">
    <h3 class="p-3">Epoch</h3>
    <router-link to="/epochs">more epochs</router-link>
    <table class="m-auto table table-hover w-100" v-for="[[exp, symbol], expansion] of [[['Serendale', 'Jewel'], 'sd'], [['Crystalvale', 'Crystal'], 'cv']]" :key="symbol">
      <thead>
      <tr>
        <th colspan="4" class="text-start">{{ exp }}</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="text-start">Current epoch</td>
        <td class="text-end">{{ epoch(expansion).epoch }}</td>
        <td class="text-start">Current unlock rate</td>
        <td class="text-end">{{ epoch(expansion).unlock }}%</td>
      </tr>
      <tr>
        <td class="text-start">Current multiplier</td>
        <td class="text-end">{{ epoch(expansion).multiplier }}x</td>
        <td class="text-start">Current lock rate</td>
        <td class="text-end">{{ Math.max(0, (100 - epoch(expansion).unlock)) }}%</td>
      </tr>
      <tr>
        <td class="text-start">Next epoch in </td>
        <td class="text-end">{{ nextEpochString(expansion) }}</td>
        <td class="text-start">Additional {{ symbol }} to claim if you wait</td>
        <td class="text-end">{{ additionalTokens(expansion) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import epochFuncs from '../../data/Epochs'
import formatNumber from "../../utils/FormatNumber";

export default {
  name: "PersonalEpoch",
  inject: ["epoch", "blockNumber", "totalPending"],
  methods: {
    formatNumber(num) {
      return formatNumber(num)
    },
    additionalTokens(expansion) {
      const currentEpoch = this.epoch(expansion)
      const totalPending = this.totalPending(expansion)
      if(currentEpoch["epoch"] > 0 && totalPending > 0) {
        const nextEpoch =  epochFuncs.epochData(currentEpoch.epoch + 1, expansion)
        const claimableNow = totalPending * currentEpoch.unlock / 100
        const claimableNext = totalPending * nextEpoch.unlock / 100
        return formatNumber(claimableNext - claimableNow)
      } else
        return ""
    },
    nextEpochString(expansion) {
      const currentEpoch = this.epoch(expansion)["epoch"]
      const blockNumber = this.blockNumber(expansion)
      if (currentEpoch > 0 && blockNumber > 0) {
        return epochFuncs.timeLeftUntilEpochString(blockNumber, currentEpoch + 1, expansion)
      }
      else
        return ""
    }
  }
}
</script>

<style scoped>

</style>