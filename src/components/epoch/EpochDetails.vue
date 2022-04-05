<template>
  <tr>
    <th class="text-start">Epoch #</th>
    <th class="text-end">{{ sdEpoch["epoch"] }}</th>
    <th class="text-end">{{ cvEpoch["epoch"] }}</th>
  </tr>
  <tr>
    <td class="text-start">Unlock rate</td>
    <td class="text-end">
      <span v-if="sdEpoch.unlock >0">{{ sdEpoch["unlock"] }}%</span>
    </td>
    <td class="text-end">
      <span v-if="cvEpoch.unlock >0">{{ cvEpoch["unlock"] }}%</span>
    </td>
  </tr>
  <tr>
    <td class="text-start">Multiplier</td>
    <td class="text-end">
      <span v-if="sdEpoch.multiplier > 0">{{ sdEpoch["multiplier"] }}x</span>
    </td>
    <td class="text-end">
      <span v-if="cvEpoch.multiplier > 0">{{ cvEpoch["multiplier"] }}x</span>
    </td>
  </tr>
  <tr>
    <td class="text-start">Time until</td>
    <td class="text-end">
      <span v-if="sdEpoch.timeLeftString != ''">{{ sdEpoch["timeLeftString"] }}</span>
      </td>
    <td class="text-end">
      <span v-if="cvEpoch.timeLeftString != ''">{{ cvEpoch["timeLeftString"] }}</span>
      </td>
  </tr>
</template>

<script>
export default {
  name: "EpochDetails",
  props: ["whichEpoch", 'expansion'],
  inject: ["getEpoch"],
  computed: {
    sdEpoch() {
      return this.getEpoch(this.whichEpoch, 'sd')
    },
    cvEpoch() {
      return this.getEpoch(this.whichEpoch, 'cv')
    }
  }
}
</script>

<style scoped>

</style>