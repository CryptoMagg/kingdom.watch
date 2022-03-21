<template>
  <div class="row">
    <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3" v-for="hero in heroes()" :key="hero">
      <table class="table table-striped">
        <thead>
        <tr>
          <th class="text-start">Hero ID</th>
          <th class="text-end">{{ hero.heroId }}</th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td class="text-start">Total XP</td>
          <td class="text-end">{{ hero.xp }}</td>
        </tr>
        <tr>
          <td class="text-start">Stamina spent</td>
          <td class="text-end">{{ hero.staminaSpent }}</td>
        </tr>

        <tr v-for="reward in hero.rewards" :key="reward">
          <td class="text-start">
            <img :src="reward.item.logoURI" :alt="reward.item.name"  style="width: 50px;"/>
            {{ reward.item.name }}
          </td>
          <td class="text-end">{{ formatNumber(reward.amount) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import formatNumber from "@/utils/FormatNumber";

export default {
  name: "QuestsByHero",
  inject: ["heroes"],
  methods: {
    formatNumber(num, prefix, suffix, decimals) {
      return formatNumber(num, prefix, suffix, decimals)
    },
  }
}
</script>

<style scoped>

</style>
