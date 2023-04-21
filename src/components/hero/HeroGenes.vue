<template>
  <div class="col-sm-12 col-md-6 col-lg-4">
    <table class="table">
      <thead>
      <tr>
        <th class="text-start">Gene</th>
        <th class="text-end">R1 (~20%)</th>
        <th class="text-end">R2 (~4%)</th>
        <th class="text-end">R3 (~1%)</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="text-start">Main class</td>
        <td class="text-end">{{ cap(genes[1].class) }}</td>
        <td class="text-end">{{ cap(genes[2].class) }}</td>
        <td class="text-end">{{ cap(genes[3].class) }}</td>
      </tr>
      <tr>
        <td class="text-start">Sub class</td>
        <td class="text-end">{{ cap(genes[1].subClass) }}</td>
        <td class="text-end">{{ cap(genes[2].subClass) }}</td>
        <td class="text-end">{{ cap(genes[3].subClass) }}</td>
      </tr>
      <tr>
        <td class="text-start">Profession</td>
        <td class="text-end">{{ cap(genes[1].profession) }}</td>
        <td class="text-end">{{ cap(genes[2].profession) }}</td>
        <td class="text-end">{{ cap(genes[3].profession) }}</td>
      </tr>
      <tr>
        <td class="text-start greeneGene">Green boost</td>
        <td class="text-end greeneGene">{{ cap(genes[1].statBoost1) }}</td>
        <td class="text-end greeneGene">{{ cap(genes[2].statBoost1) }}</td>
        <td class="text-end greeneGene">{{ cap(genes[3].statBoost1) }}</td>
      </tr>
      <tr>
        <td class="text-start blueGene">Blue boost</td>
        <td class="text-end blueGene">{{ cap(genes[1].statBoost2) }}</td>
        <td class="text-end blueGene">{{ cap(genes[2].statBoost2) }}</td>
        <td class="text-end blueGene">{{ cap(genes[3].statBoost2) }}</td>
      </tr>
      </tbody>
    </table>

    <table class="table">
      <thead>
      <tr>
        <th class="text-start">Stat growth</th>
        <th class="text-end">Primary</th>
        <th class="text-end">Secondary</th>
        <th class="text-end">Total</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="text-start">{{ cap("agility")}}</td>
        <td class="text-end">{{ growth["p"]["agility"] }} %</td>
        <td class="text-end">{{ growth["s"]["agility"] }} %</td>
        <td class="text-end">{{ growth["t"]["agility"] }} %</td>
      </tr>
      <tr>
        <td class="text-start">{{ cap("dexterity")}}</td>
        <td class="text-end">{{ growth["p"]["dexterity"] }} %</td>
        <td class="text-end">{{ growth["s"]["dexterity"] }} %</td>
        <td class="text-end">{{ growth["t"]["dexterity"] }} %</td>
      </tr>
      <tr>
        <td class="text-start">{{ cap("endurance")}}</td>
        <td class="text-end">{{ growth["p"]["endurance"] }} %</td>
        <td class="text-end">{{ growth["s"]["endurance"] }} %</td>
        <td class="text-end">{{ growth["t"]["endurance"] }} %</td>
      </tr>
      <tr>
        <td class="text-start">{{ cap("intelligence")}}</td>
        <td class="text-end">{{ growth["p"]["intelligence"] }} %</td>
        <td class="text-end">{{ growth["s"]["intelligence"] }} %</td>
        <td class="text-end">{{ growth["t"]["intelligence"] }} %</td>
      </tr>
      <tr>
        <td class="text-start">{{ cap("luck")}}</td>
        <td class="text-end">{{ growth["p"]["luck"] }} %</td>
        <td class="text-end">{{ growth["s"]["luck"] }} %</td>
        <td class="text-end">{{ growth["t"]["luck"] }} %</td>
      </tr>
      <tr>
        <td class="text-start">{{ cap("strength")}}</td>
        <td class="text-end">{{ growth["p"]["strength"] }} %</td>
        <td class="text-end">{{ growth["s"]["strength"] }} %</td>
        <td class="text-end">{{ growth["t"]["strength"] }} %</td>
      </tr>
      <tr>
        <td class="text-start">{{ cap("vitality")}}</td>
        <td class="text-end">{{ growth["p"]["vitality"] }} %</td>
        <td class="text-end">{{ growth["s"]["vitality"] }} %</td>
        <td class="text-end">{{ growth["t"]["vitality"] }} %</td>
      </tr>
      <tr>
        <td class="text-start">{{ cap("wisdom")}}</td>
        <td class="text-end">{{ growth["p"]["wisdom"] }} %</td>
        <td class="text-end">{{ growth["s"]["wisdom"] }} %</td>
        <td class="text-end">{{ growth["t"]["wisdom"] }} %</td>
      </tr>

      </tbody>
    </table>
  </div>
</template>

<script>
import {capitalize} from "lodash";

export default {
  name: "HeroGenes",
  inject: ["heroData"],
  computed: {
    genes() {
      const heroData = this.heroData()

      if(!heroData.id)
        return [{},{},{},{}]
      else
        return heroData.recessiveGenes
    },
    growth() {
      const heroData = this.heroData()
      if(!heroData.id)
        return {
          p: {},
          s: {},
					t: {}
        }

      const p = {}
      for (const [stat,growth] of Object.entries(heroData.pStatGrowth)) {
        p[stat] = (growth / 100).toFixed(2);
      }

      const s = {}
      for (const [stat,growth] of Object.entries(heroData.sStatGrowth)) {
        s[stat] = (growth / 100).toFixed(2);
      }

			const t = {}
			for(const stat in p){
				t[stat] = ((heroData.pStatGrowth[stat] + heroData.sStatGrowth[stat])/ 100).toFixed(2);
			}

      return {p,s,t}

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
.greeneGene {
  color: green;
}
.blueGene {
  color: dodgerblue;
}
</style>
