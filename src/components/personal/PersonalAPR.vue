<template>
  <tr>
    <th class="text-start">Total</th>
    <th class="text-end">Day</th>
    <th class="text-end">Week</th>
    <th class="text-end">Year</th>
  </tr>
  <tr>
    <td class="text-start">APR</td>
    <td class="text-end">{{ formatNumber(apr(expansion),'','%') }}</td>
    <td class="text-end">{{ formatNumber(apr(expansion) * 7,'','%') }}</td>
    <td class="text-end">{{ formatNumber(apr(expansion) * 365,'','%') }}</td>
  </tr>
  <tr>
    <td class="text-start">Jewels</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay(expansion)) }}</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay(expansion) * 7) }}</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay(expansion) * 365) }}</td>
  </tr>
  <tr>
    <td class="text-start">USD</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay(expansion) * prices(expansion),'$') }}</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay(expansion) * prices(expansion) * 7,'$') }}</td>
    <td class="text-end">{{ formatNumber(userRewardsPerDay(expansion) * prices(expansion) * 365,'$') }}</td>
  </tr>
  <tr>
    <th class="text-start">Unlocked ({{ unlock() }}%)</th>
    <th class="text-end">Day</th>
    <th class="text-end">Week</th>
    <th class="text-end">Year</th>
  </tr>
  <tr>
    <td class="text-start">APR</td>
    <td class="text-end">{{ formatNumber(apr(expansion) * unlock() / 100,'','%') }}</td>
    <td class="text-end">{{ formatNumber(apr(expansion) * unlock() / 100 * 7,'','%') }}</td>
    <td class="text-end">{{ formatNumber(apr(expansion) * unlock() / 100 * 365,'','%') }}</td>
  </tr>

  <tr>
    <td class="text-start">Jewels</td>
    <td class="text-end">{{ formatNumber(unlockedPerDay(expansion)) }}</td>
    <td class="text-end">{{ formatNumber(unlockedPerDay(expansion) * 7) }}</td>
    <td class="text-end">{{ formatNumber(unlockedPerDay(expansion) * 365) }}</td>
  </tr>
  <tr>
    <td class="text-start">USD</td>
    <td class="text-end">{{ formatNumber(unlockedPerDay(expansion) * prices(expansion),'$') }}</td>
    <td class="text-end">{{ formatNumber(unlockedPerDay(expansion) * prices(expansion) * 7,'$') }}</td>
    <td class="text-end">{{ formatNumber(unlockedPerDay(expansion) * prices(expansion) * 365,'$') }}</td>
  </tr>

</template>

<script>
import formatNumber from "../../utils/FormatNumber";

export default {
  name: "PersonalAPR",
  props: ["expansion"],
  methods: {
    formatNumber(num, prefix, suffix) {
      return formatNumber(num, prefix, suffix)
    },
    unlock() {
      if (!this.expansion) return 0
      return this.epoch(this.expansion).unlock
    },
    unlockedPerDay(expansion) {
      return this.userRewardsPerDay(expansion) * this.unlock() / 100
    },
  },
  inject: ["apr", "userRewardsPerDay", "prices", "epoch"],
}
</script>

<style scoped>

</style>