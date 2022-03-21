<template>
  <div class="row">
    <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3" v-for="quest in quests()" :key="quest">
      <table class="table table-striped">
        <thead>
        <tr>
          <th class="text-start">
            {{ professionString(quest.profession) }}
            Quest
          </th>
          <th class="text-end">{{ quest.questId }}</th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td colspan="2" class="text-end">&nbsp;{{ quest.time }}</td>
        </tr>
        <tr>
          <td class="text-start">Total XP</td>
          <td class="text-end">{{ quest.xp }}</td>
        </tr>
        <tr>
          <td class="text-start">Total skill up</td>
          <td class="text-end">{{ quest.skillUp / 10 }}</td>
        </tr>
        <tr v-for="reward in quest.rewards" :key="reward">
          <td class="text-start">
            <img :src="reward.item.logoURI" :alt="reward.item.name" style="width: 50px;"/>
            {{ reward.item.name }}
          </td>
          <td class="text-end">{{ formatNumber(reward.amount) }}</td>
        </tr>
        <tr v-for="heroId in quest.heroes" :key="heroId">
          <td class="text-start">Hero</td>
          <td class="text-end">{{ heroId }}</td>
        </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import formatNumber from "@/utils/FormatNumber";

export default {
  name: "QuestsByQuest",
  inject: ["quests","professionString"],
  methods: {
    formatNumber(num, prefix, suffix, decimals) {
      return formatNumber(num, prefix, suffix, decimals)
    },
  }
}
</script>

<style scoped>

</style>
