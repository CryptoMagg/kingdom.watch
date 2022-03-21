<template>
  <tr>
    <th class="text-start">Epoch #</th>
    <th class="text-end">{{ epoch["epoch"] }}</th>
  </tr>
  <tr>
    <td class="text-start">Unlock rate</td>
    <td class="text-end">
      <span v-if="epoch.unlock >0">{{ epoch["unlock"] }}%</span>
    </td>
  </tr>
  <tr>
    <td class="text-start">Multiplier</td>
    <td class="text-end">
      <span v-if="epoch.multiplier > 0">{{ epoch["multiplier"] }}x</span>
    </td>
  </tr>
  <tr v-if="!!epoch['timeLeftString']">
    <td class="text-start">Time until</td>
    <td class="text-end">{{ epoch["timeLeftString"] }}</td>
  </tr>
</template>

<script>
export default {
  name: "EpochDetails",
  props: ["whichEpoch"],
  inject: ["getEpoch"],
  computed: {
    epoch() {
      return this.getEpoch(this.whichEpoch)
    }
  }
}
</script>

<style scoped>

</style>