<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h3>Hero #{{ displayHero.id }}</h3>
        <table class="table">
          <tbody>
          <tr>
            <td>Generation</td>
            <td>{{ displayHero.generation }}</td>
          </tr>
          <tr>
            <td>Rarity</td>
            <td><span :class="displayHero.rarity">{{ displayHero.rarity }}</span></td>
          </tr>
          <tr>
            <td>Main class</td>
            <td>{{ displayHero.mainClass }}</td>
          </tr>
          <tr>
            <td>Sub class</td>
            <td>{{ displayHero.subClass }}</td>
          </tr>
          <tr>
            <td>Profession</td>
            <td>{{ displayHero.profession }}</td>
          </tr>
          <tr>
            <td>Green Gene</td>
            <td>{{ displayHero.greenGene }}</td>
          </tr>
          <tr>
            <td>Blue Gene</td>
            <td>{{ displayHero.blueGene }}</td>
          </tr>
          <tr v-for="[short, long] in stats" :key="short">
            <td>
              <span v-if="short == displayHero.greenGene" style="color: forestgreen">{{ short }}</span>
              <span v-else-if="short == displayHero.blueGene" style="color: dodgerblue">{{ short }}</span>
              <span v-else>{{ short }}</span>
            </td>
            <td v-if="displayHero.stats" >{{ displayHero.stats[long] }}</td>
          </tr>
          <tr v-for="prof in professions" :key="prof">
            <template v-if="prof == professionScores['bestProfession']">
              <th>{{ cap(prof) }} (best)</th>
              <th>{{ professionScores[prof] }}</th>
            </template>
            <template v-else>
              <td>{{ cap(prof) }}</td>
              <td>{{ professionScores[prof] }}</td>
            </template>
          </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
//import _ from 'lodash'

import {valuateAllProfessions, professions} from "@/utils/HeroValuation";
import {stats} from "@/utils/Heroes";
import {capitalize} from "lodash";

export default {
  name: "HeroValuationProfession",
  inject: ["heroData"],
  data() {
    return {
      professions: professions,
      stats: stats,
    }
  },
  computed: {
    displayHero() {

      const heroData = this.heroData()

      if(heroData.id)
        return heroData
      else
        return {}
    },
    professionScores() {
      const heroData = this.heroData()

      if(!heroData.id)
        return {}

      return valuateAllProfessions(heroData)
    }
  },
  methods: {
    cap(str) {
      return capitalize(str)
    }
  }
}
</script>

<style scoped>
.Common {
}

.Uncommon {
  color: #14C25A
}

.Rare {
  color: #21CCFF
}

.Legendary {
  color: #ffa32d
}

.Mythic {
  color: #df5bff
}

</style>