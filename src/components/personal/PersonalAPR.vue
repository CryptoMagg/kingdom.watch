<template>
  <tr>
    <th className="text-start">Total</th>
    <th className="text-end">Day</th>
    <th className="text-end">Week</th>
    <th className="text-end">Year</th>
  </tr>
  <tr>
    <td className="text-start">APR</td>
    <td className="text-end">{{ formatNumber(apr(expansion), '', '% ') }}</td>
    <td className="text-end">{{ formatNumber(apr(expansion) * 7, '', '% ') }}</td>
    <td className="text-end">{{ formatNumber(apr(expansion) * 365, '', '% ') }}</td>
  </tr>
  <tr>
    <td className="text-start">{{ expansionTokenMap[expansion] }}</td>
    <td className="text-end">{{ formatNumber(userRewardsPerDay(expansion)) }}</td>
    <td className="text-end">{{ formatNumber(userRewardsPerDay(expansion) * 7) }}</td>
    <td className="text-end">{{ formatNumber(userRewardsPerDay(expansion) * 365) }}</td>
  </tr>
  <tr>
    <td className="text-start">USD</td>
    <td className="text-end">{{ formatNumber(userRewardsPerDay(expansion) * prices(expansion), '$ ') }}</td>
    <td className="text-end">{{ formatNumber(userRewardsPerDay(expansion) * prices(expansion) * 7, '$ ') }}</td>
    <td className="text-end">{{ formatNumber(userRewardsPerDay(expansion) * prices(expansion) * 365, '$ ') }}</td>
  </tr>
  <tr>
    <th className="text-start">Unlocked ({{ epoch(expansion).unlock }}%)</th>
    <th className="text-end">Day</th>
    <th className="text-end">Week</th>
    <th className="text-end">Year</th>
  </tr>
  <tr>
    <td className="text-start">APR</td>
    <td className="text-end">{{ formatNumber(apr(expansion) * this.epoch(expansion).unlock / 100, '', '% ') }}</td>
    <td className="text-end">{{ formatNumber(apr(expansion) * this.epoch(expansion).unlock / 100 * 7, '', '% ') }}</td>
    <td className="text-end">{{ formatNumber(apr(expansion) * this.epoch(expansion).unlock / 100 * 365, '', '% ') }}</td>
  </tr>

  <tr>
    <td className="text-start">{{ expansionTokenMap[expansion] }}</td>
    <td className="text-end">{{ formatNumber(unlockedPerDay) }}</td>
    <td className="text-end">{{ formatNumber(unlockedPerDay * 7) }}</td>
    <td className="text-end">{{ formatNumber(unlockedPerDay * 365) }}</td>
  </tr>
  <tr>
    <td className="text-start">USD</td>
    <td className="text-end">{{ formatNumber(unlockedPerDay * prices(expansion), '$ ') }}</td>
    <td className="text-end">{{ formatNumber(unlockedPerDay * prices(expansion) * 7, '$ ') }}</td>
    <td className="text-end">{{ formatNumber(unlockedPerDay * prices(expansion) * 365, '$ ') }}</td>
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
  },
  data() {
    return {
      expansionTokenMap : {
        'sd': 'Jewel',
        'cv': 'Crystal',
        'sd2': 'Jade'
      }
    }
  },
  inject: ["apr", "userRewardsPerDay", "prices", "epoch"],
  computed: {
    unlockedPerDay() {
      return this.userRewardsPerDay(this.expansion) * this.epoch(this.expansion).unlock / 100
    },
  }
}
</script>

<style scoped>

</style>