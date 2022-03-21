<template>
  <tr>
    <th class="text-start">Total</th>
    <th class="text-end">Day</th>
    <th class="text-end">Week</th>
    <th class="text-end">Year</th>
  </tr>
  <tr>
    <td class="text-start">APR</td>
    <td class="text-end">{{ formatNumber(apr(),'','%') }}</td>
    <td class="text-end">{{ formatNumber(apr() * 7,'','%') }}</td>
    <td class="text-end">{{ formatNumber(apr() * 365,'','%') }}</td>
  </tr>
  <tr>
    <td class="text-start">Jewels</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay()) }}</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay() * 7) }}</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay() * 365) }}</td>
  </tr>
  <tr>
    <td class="text-start">USD</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay() * prices()["JEWEL"],'$') }}</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay() * prices()["JEWEL"] * 7,'$') }}</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay() * prices()["JEWEL"] * 365,'$') }}</td>
  </tr>
  <tr>
    <th class="text-start">Unlocked ({{ epoch().unlock }}%)</th>
    <th class="text-end">Day</th>
    <th class="text-end">Week</th>
    <th class="text-end">Year</th>
  </tr>
  <tr>
    <td class="text-start">APR</td>
    <td class="text-end">{{ formatNumber(apr() * this.epoch().unlock / 100,'','%') }}</td>
    <td class="text-end">{{ formatNumber(apr() * this.epoch().unlock / 100 * 7,'','%') }}</td>
    <td class="text-end">{{ formatNumber(apr() * this.epoch().unlock / 100 * 365,'','%') }}</td>
  </tr>

  <tr>
    <td class="text-start">Jewels</td>
    <td class="text-end">{{ formatNumber(unlockedJewelsPerDay) }}</td>
    <td class="text-end">{{ formatNumber(unlockedJewelsPerDay * 7) }}</td>
    <td class="text-end">{{ formatNumber(unlockedJewelsPerDay * 365) }}</td>
  </tr>
  <tr>
    <td class="text-start">USD</td>
    <td class="text-end">{{ formatNumber(unlockedJewelsPerDay * prices()["JEWEL"],'$') }}</td>
    <td class="text-end">{{ formatNumber(unlockedJewelsPerDay * prices()["JEWEL"] * 7,'$') }}</td>
    <td class="text-end">{{ formatNumber(unlockedJewelsPerDay * prices()["JEWEL"] * 365,'$') }}</td>
  </tr>

</template>

<script>
import formatNumber from "../../utils/FormatNumber";

export default {
  name: "PersonalAPR",
  methods: {
    formatNumber(num, prefix, suffix) {
      return formatNumber(num, prefix, suffix)
    },
  },
  inject: ["apr", "userRewardsPerDay", "prices", "epoch"],
  computed: {
    unlockedJewelsPerDay() {
      return this.userRewardsPerDay() * this.epoch().unlock / 100
    },
  }
}
</script>

<style scoped>

</style>