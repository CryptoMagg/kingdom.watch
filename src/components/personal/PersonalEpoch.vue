<template>
  <div class="col-lg-8 m-auto border border-dark rounded-3">
    <h3 class="p-3">Epoch</h3>
    <router-link to="/epochs">more epochs</router-link>
    <table class="m-auto table table-hover w-100">
      <tbody>
      <tr>
        <td class="text-start">Current epoch</td>
        <td class="text-end">{{ epoch().epoch }}</td>
        <td class="text-start">Current unlock rate</td>
        <td class="text-end">{{ epoch().unlock }}%</td>
      </tr>
      <tr>
        <td class="text-start">Current multiplier</td>
        <td class="text-end">{{ epoch().multiplier }}x</td>
        <td class="text-start">Current lock rate</td>
        <td class="text-end">{{ Math.max(0, (100 - epoch().unlock)) }}%</td>
      </tr>
      <tr>
        <td class="text-start">Next epoch in </td>
        <td class="text-end">{{ nextEpochString }}</td>
        <td class="text-start">Additional Jewels to claim if you wait</td>
        <td class="text-end">{{ additionalJewels }}</td>
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
  inject: ["epoch", "blockNumber","totalPendingJewels"],
  methods: {
    formatNumber(num) {
      return formatNumber(num)
    },
  },
  computed: {
    additionalJewels() {
      const currentEpoch = this.epoch()
      const totalPending = this.totalPendingJewels()

      if(currentEpoch["epoch"] > 0 && totalPending > 0) {
        const nextEpoch =  epochFuncs.epochData(currentEpoch.epoch + 1)

        const claimableNow = totalPending * currentEpoch.unlock / 100
        const claimableNext = totalPending * nextEpoch.unlock / 100

        return formatNumber(claimableNext - claimableNow)

      } else
        return ""
    },
    nextEpochString() {
      const currentEpoch = this.epoch()["epoch"]
      const blockNumber = this.blockNumber()

      if (currentEpoch > 0 && blockNumber > 0)
        return epochFuncs.timeLeftUntilEpochString(blockNumber, currentEpoch + 1)
      else
        return ""
    }
  }
}
</script>

<style scoped>

</style>