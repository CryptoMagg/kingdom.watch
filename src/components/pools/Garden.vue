<template>
  <!--    <pre class="text-start">{{ gardenInfo }}</pre>-->
  <tr class="text-light bg-dark">
    <td>Pair</td>
    <td colspan="2">{{ gardenInfo.tokens[0].symbol }} / {{ gardenInfo.tokens[1].symbol }}</td>
  </tr>
  <tr>
    <td>Pool share and value</td>
    <td>{{ (gardenInfo.userShare * 100).toFixed(4) }}%</td>
    <td>${{ (jewelValue * prices["JEWEL"]).toFixed(2)}}</td>
  </tr>
  <tr>
    <td>{{ gardenInfo.tokens[0].symbol }}</td>
    <td>{{ (gardenInfo.tokens[0].totalStaked * gardenInfo.userShare).toFixed(4) }}</td>
    <td class="text-end">
      <template v-if="gardenInfo.impermanentLoss[0] > 0">+</template>
      {{ gardenInfo.impermanentLoss[0].toFixed(4) }}
    </td>
  </tr>
  <tr>
    <td>{{ gardenInfo.tokens[1].symbol }}</td>
    <td>{{ (gardenInfo.tokens[1].totalStaked * gardenInfo.userShare).toFixed(4) }}</td>
    <td class="text-end">
      <template v-if="gardenInfo.impermanentLoss[1] > 0">+</template>
      {{ gardenInfo.impermanentLoss[1].toFixed(4) }}
    </td>

  </tr>
  <tr>
    <td>Jewels per day (unlocked)</td>
    <td>{{ (gardenInfo.rewardPerDay * gardenInfo.userShare).toFixed(2) }}</td>
    <td>({{ (gardenInfo.rewardPerDay * gardenInfo.userShare * epoch.unlock / 100).toFixed(2) }})</td>
  </tr>
  <tr>
    <td>Pending Jewels (unlocked)</td>
    <td>{{ gardenInfo.pendingRewards.toFixed(2) }}</td>
    <td>({{ (gardenInfo.pendingRewards * epoch.unlock / 100).toFixed(2) }})</td>
  </tr>
  <tr>
    <td v-if="apr > 0">APR % d/w/y</td>
    <td colspan="2">{{ apr.toFixed(1) }}% / {{ (apr * 7).toFixed(1) }}% / {{ (apr * 365).toFixed(1) }}%</td>
  </tr>
  <tr>
    <td v-if="apr > 0">Total USD Yield d/w/y</td>
    <td colspan="2">${{ usdDay.toFixed(2) }} / ${{ (usdDay * 7).toFixed(1) }} / ${{ (usdDay * 365).toFixed(1) }}</td>
  </tr>
  <tr>
    <td v-if="apr > 0">Unlocked USD Yield d/w/y</td>
    <td colspan="2">${{ (usdDay * epoch.unlock / 100).toFixed(2) }} / ${{ (usdDay * epoch.unlock / 100 * 7).toFixed(1) }} / ${{ (usdDay * epoch.unlock / 100 * 365).toFixed(1) }}</td>
  </tr>
</template>

<script>
export default {
  name: "Garden",
  props: [
    "gardenInfo",
    "epoch",
    "prices"],
  computed: {
    jewelValue() {
      if(this.gardenInfo.tokens[0].symbol === "JEWEL")
        return this.gardenInfo.tokens[0].totalStaked * this.gardenInfo.userShare * 2

      else if(this.gardenInfo.tokens[1].symbol === "JEWEL")
        return this.gardenInfo.tokens[1].totalStaked * this.gardenInfo.userShare * 2

      else
        return 0
    },
    apr() {
      if(this.jewelValue <= 0)
        return 0

      return this.gardenInfo.rewardPerDay  * this.gardenInfo.userShare / this.jewelValue * 100
    },
    usdDay() {
      if(this.jewelValue <= 0)
        return 0

      return this.gardenInfo.rewardPerDay  * this.gardenInfo.userShare * this.prices["JEWEL"]
    }
  }
}
</script>

<style scoped>

</style>