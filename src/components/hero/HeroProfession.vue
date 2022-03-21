<template>
  <div class="col-sm-12 col-md-6 col-lg-5">
    <table class="table">
      <thead>
      <tr>
        <th class="text-start">Profession</th>
        <th class="text-end">Score</th>
        <th class="text-end">% of max</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="prof in professions" :key="prof" :class="{'table-success': prof.highestRelative}">
        <td class="text-start" :class="{born: prof.born}">
          {{ cap(prof.name) }}
          <span v-if="prof.best" class="text-warning">(highest score)</span>
          <span v-if="prof.highestRelative" class="text-info">(highest relative)</span>
        </td>
        <td class="text-end">{{ prof.score }}</td>
        <td class="text-end">{{ prof.ofMax }} %</td>
      </tr>
      </tbody>
    </table>
    <p>
      <span class="font-monospace">Kingdom.Watch Profession Score v0.5.1 (KWPS)</span> is used to calculate the score per profession, described
      <router-link to="/about/heroranking">here</router-link>. Credit goes to @GokMachar for the initial idea.
    </p>
  </div>
</template>

<script>
import {capitalize} from "lodash";

export default {
  name: "HeroProfession",
  inject: ["heroData","professionLeaders"],
  computed: {
    professions() {
      const heroData = this.heroData()

      if (!heroData.id) {
        return {
          mining: {name: "mining"},
          fishing: {name: "fishing"},
          gardening: {name: "gardening"},
          foraging: {name: "foraging"},
        }
      }

      const professions = {}
      const max = this.professionLeaders()

      for (let prof of ["mining", "fishing", "gardening", "foraging"]) {
        professions[prof] = {
          name: prof,
          score: heroData.professionScores[prof].toFixed(0),
          best: prof === heroData.professionScores.bestProfession,
          born: prof === heroData.profession,
          ofMax: (heroData.professionScores[prof] / max[prof] * 100).toFixed(1) * 1,
          highestRelative: false,
        }
      }

      let maxRelative = 0
      let maxRelativeName = ""

      for(let name of ["mining", "fishing", "gardening", "foraging"]) {
        const p = professions[name]
        if(p.ofMax > maxRelative) {
          maxRelative = p.ofMax
          maxRelativeName = p.name
        }
      }

      if(professions[maxRelativeName])
        professions[maxRelativeName]["highestRelative"] = true

      return professions
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
.born {
  color: forestgreen;
}
</style>
