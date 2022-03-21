<template>
  <div class="col-sm-6 col-md-4 col-lg-3">
    <h4>Top 10 {{ cap(profession) }}</h4>
    <table class="table">
      <thead>
      <tr>
        <th class="text-start">Place</th>
        <th class="text-end">Hero ID#</th>
        <th class="text-end">Score</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="(hero, idx) in leaders" :key="hero" @click="this.loadHero(hero.heroId)" :class="{'table-secondary': hero.heroId == selectedHeroId}">
        <td class="text-start">{{ idx + 1 }}</td>
        <td class="text-end">{{ hero.heroId }}</td>
        <td class="text-end">{{ hero.score.toFixed(0) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {capitalize} from "lodash";

export default {
  name: "HeroLeaderboard",
  props: ["profession"],
  inject: ["leaderboard", "loadHero", "heroData"],
  computed: {
    leaders() {
      const leaderboard = this.leaderboard()

      if(!leaderboard.maxHeroId || leaderboard.maxHeroId < 0)
        return []

      return leaderboard[this.profession]
    },
    selectedHeroId() {
      const heroData = this.heroData()

      if (!heroData.id)
        return -1
      else
        return heroData.id
    },
  },
  methods: {
    cap(str) {
      return capitalize(str)
    }
  }
}
</script>

<style scoped>

</style>