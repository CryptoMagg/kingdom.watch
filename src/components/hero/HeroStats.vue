<template>
  <div class="col-sm-12 col-md-6 col-lg-3">
    <table class="table">
      <thead>
        <tr>
          <th class="text-start">Stat</th>
          <th/>
          <th class="text-start">Stat</th>
          <th/>
        </tr>
      </thead>
      <tbody>
      <tr>
        <td class="text-start" :class="statsClass.STR">STR</td>
        <td>{{ statsValues.strength }}</td>
        <td class="text-start" :class="statsClass.DEX">DEX</td>
        <td>{{ statsValues.dexterity }}</td>
      </tr>
      <tr>
        <td class="text-start" :class="statsClass.AGI">AGI</td>
        <td>{{ statsValues.agility }}</td>
        <td class="text-start" :class="statsClass.VIT">VIT</td>
        <td>{{ statsValues.vitality }}</td>
      </tr>
      <tr>
        <td class="text-start" :class="statsClass.END">END</td>
        <td>{{ statsValues.endurance }}</td>
        <td class="text-start" :class="statsClass.INT">INT</td>
        <td>{{ statsValues.intelligence }}</td>
      </tr>
      <tr>
        <td class="text-start" :class="statsClass.WIS">WIS</td>
        <td>{{ statsValues.wisdom }}</td>
        <td class="text-start" :class="statsClass.LCK">LCK</td>
        <td>{{ statsValues.luck }}</td>
      </tr>
      </tbody>
    </table>
    <p class="text-start" v-if="heroData().id">
      <span v-if="heroData().generation > 0">{{ heroData().summonsLeft }}</span>
      <span v-else>&nbsp;&infin;</span>
      Summons left
    </p>
    <p class="text-start" v-if="heroData().id">Level {{ heroData().level }}</p>
    <p class="text-start" v-if="heroData().id">{{ heroData().xp }} XP</p>

    <p class="text-start" v-if="heroData().id">
      <span v-if="heroData().staminaFullIn > 0">{{ heroData().staminaFullIn }} minutes until full stamina</span>
      <span v-else>Stamina full</span>
    </p>

    <p class="text-start" v-if="heroData().id">Can summon after {{ heroData().nextSummonTime }}</p>

    <p class="text-start" v-if="heroData().id">
      Floor price <strong>{{ heroData()["floor"]["price"] }}</strong> with
      <router-link to="/about/floorprice">confidence</router-link> <em>{{ heroData()["floor"]["confidence"] }}</em>
    </p>
  </div>
</template>

<script>
import {stats} from "@/utils/Heroes";

export default {
  name: "HeroStats",
  inject: ["heroData"],
  computed: {
    statsClass() {
      const heroData = this.heroData()

      if (!heroData.id)
        return {}

      const classes = {}

      for(let stat of stats.keys()) {
        if(stat === heroData.greenGene && stat === heroData.blueGene)
          classes[stat] = "purpleGene"
        else if(stat === heroData.greenGene)
          classes[stat] = "greeneGene"
        else if(stat === heroData.blueGene)
          classes[stat] = "blueGene"
        else
          classes[stat] = "normal"
      }

      return classes
    },
    statsValues() {
      const heroData = this.heroData()

      if(!heroData.id)
        return {}

      return heroData.stats
    }
  }
}
</script>

<style scoped>
.normal {

}
.greeneGene {
  color: green;
}
.blueGene {
  color: dodgerblue;
}

.purpleGene {
  color: purple;
}
</style>
