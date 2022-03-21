<template>
  <div class="col">
    <p>Click the hero you want to inspect</p>
    <p>Floor prices are described in more detail <router-link to="/about/floorprice">here</router-link></p>
    <table class="table table-hover w-100">
      <thead>
      <tr>
        <th class="text-start">ID#
          <SortIcon field="id"/>
        </th>
        <!--        <th class="text-start">Hero</th>-->
        <th class="text-end">Gen
          <SortIcon field="gen"/>
        </th>
        <th class="text-end">Lvl
          <SortIcon field="lvl"/>
        </th>
        <th class="text-start">Rarity
          <SortIcon field="rarity"/>
        </th>
        <th class="text-start">Class
          <SortIcon field="class"/>
        </th>
        <th class="text-start">Gene Prof
          <SortIcon field="greenProf"/>
        </th>
        <th class="text-start">Abs Prof
          <SortIcon field="bestProf"/>
        </th>
        <th class="text-end">Abs Score
          <SortIcon field="profScore"/>
        </th>
        <th class="text-start">Rel Prof
          <SortIcon field="bestRelProf"/>
        </th>
        <th class="text-end">Rel Score
          <SortIcon field="relScore"/>
        </th>
        <th class="text-end">Sum left
          <SortIcon field="sumLeft"/>
        </th>
        <th class="text-end">Sum rdy
          <SortIcon field="sumTime"/>
        </th>
        <th class="text-end">Stam
          <SortIcon field="stamina"/>
        </th>
        <th class="text-end">XP
          <SortIcon field="xp"/>
        </th>
        <th class="text-end">Floor
          <SortIcon field="floor"/>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="hero of sortedHeroes" :key="hero" @click="this.loadHero(hero.id)"
          :class="{'table-secondary': hero.id === selectedHeroId}">
        <td class="text-start">{{ hero.id }}</td>
        <!--        <td />-->
        <!--        <td class="text-start">{{ hero.info.firstName }} {{ hero.info.lastName }} </td>-->
        <td class="text-end">{{ hero.generation }}</td>
        <td class="text-end">{{ hero.level }}</td>
        <td class="text-start" :class="hero.rarity">{{ hero.rarity }}</td>
        <td class="text-start">{{ hero.mainClass }}</td>
        <td class="text-start">{{ cap(hero.profession) }}</td>
        <td class="text-start">{{ cap(hero.bestProfession) }}</td>
        <td class="text-end">{{ hero.bestProfessionScore }}</td>
        <td class="text-start">{{ cap(hero.bestRelativeProfession) }}</td>
        <td class="text-end">{{ hero.bestRelativeScore.toFixed(1) }} %</td>
        <td class="text-end">
          <span v-if="hero.generation > 0">{{ hero.summonsLeft }}</span>
          <span v-else>&nbsp;&infin;</span>
        </td>
        <td class="text-end">
          <span v-if="hero.minBeforeSummon > 0">{{ hero.minBeforeSummon }} min</span>
          <span v-else>Now</span>
        </td>
        <td class="text-end">
          <span v-if="hero.staminaFullIn > 0">{{ hero.staminaFullIn }} min</span>
          <span v-else>Full</span>
        </td>
        <td class="text-end">{{ hero.xp }}</td>
        <td class="text-end">{{ formatNumber(hero.floor.price) }}</td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td class="text-start" colspan="14">{{ heroes().length }} Heroes total. {{ priceStamp() }}</td>
        <th class="text-end">{{ formatNumber(totalFloor) }}</th>
      </tr>
      </tfoot>

    </table>
  </div>
</template>

<script>
import formatNumber from "@/utils/FormatNumber";
import {capitalize} from "lodash";
import SortIcon from "@/components/generic/SortIcon";

const defaultSort = {
  id: 0,
  gen: 0,
  lvl: 0,
  rarity: 0,
  class: 0,
  greenProf: 0,
  bestProf: 0,
  bestRelProf: 0,
  profScore: 0,
  relScore: 0,
  sumLeft: 0,
  sumTime: 0,
  stamina: 0,
  xp: 0,
  floor: 0,
}

export default {
  name: "HeroList",
  components: {SortIcon},
  inject: ["heroData", "heroes", "loadHero", "priceStamp"],
  data() {
    return {
      heroSort: {...defaultSort}
    }
  },
  computed: {
    selectedHeroId() {
      const heroData = this.heroData()

      if (!heroData.id)
        return -1
      else
        return heroData.id
    },
    sortedHeroes() {
      const sortOrder = this.heroSort
      const heroes = [...this.heroes()]

      if (sortOrder.id > 0)
        heroes.sort((a, b) => a.id - b.id)
      else if (sortOrder.id < 0)
        heroes.sort((a, b) => b.id - a.id)

      if (sortOrder.gen > 0)
        heroes.sort((a, b) => a.generation - b.generation)
      else if (sortOrder.gen < 0)
        heroes.sort((a, b) => b.generation - a.generation)

      if (sortOrder.lvl > 0)
        heroes.sort((a, b) => a.level - b.level)
      else if (sortOrder.lvl < 0)
        heroes.sort((a, b) => b.level - a.level)

      if (sortOrder.rarity > 0)
        heroes.sort((a, b) => a.rarityNum - b.rarityNum)
      else if (sortOrder.rarity < 0)
        heroes.sort((a, b) => b.rarityNum - a.rarityNum)

      if (sortOrder.class> 0)
        heroes.sort((a, b) => a.mainClass.localeCompare(b.mainClass))
      else if (sortOrder.class < 0)
        heroes.sort((a, b) => b.mainClass.localeCompare(a.mainClass))

      if (sortOrder.greenProf> 0)
        heroes.sort((a, b) => a.profession.localeCompare(b.profession))
      else if (sortOrder.greenProf < 0)
        heroes.sort((a, b) => b.profession.localeCompare(a.profession))

      if (sortOrder.bestProf> 0)
        heroes.sort((a, b) => a.bestProfession.localeCompare(b.bestProfession))
      else if (sortOrder.bestProf < 0)
        heroes.sort((a, b) => b.bestProfession.localeCompare(a.bestProfession))

      if (sortOrder.profScore > 0)
        heroes.sort((a, b) => a.bestProfessionScore - b.bestProfessionScore)
      else if (sortOrder.profScore < 0)
        heroes.sort((a, b) => b.bestProfessionScore - a.bestProfessionScore)

      if (sortOrder.bestRelProf> 0)
        heroes.sort((a, b) => a.bestRelativeProfession.localeCompare(b.bestRelativeProfession))
      else if (sortOrder.bestRelProf < 0)
        heroes.sort((a, b) => b.bestRelativeProfession.localeCompare(a.bestRelativeProfession))

      if (sortOrder.relScore > 0)
        heroes.sort((a, b) => a.bestRelativeScore - b.bestRelativeScore)
      else if (sortOrder.relScore < 0)
        heroes.sort((a, b) => b.bestRelativeScore - a.bestRelativeScore)

      if (sortOrder.sumLeft > 0)
        heroes.sort((a, b) => a.summonsLeft - b.summonsLeft)
      else if (sortOrder.sumLeft < 0)
        heroes.sort((a, b) => b.summonsLeft - a.summonsLeft)

      if (sortOrder.sumTime > 0)
        heroes.sort((a, b) => a.minBeforeSummon - b.minBeforeSummon)
      else if (sortOrder.sumTime < 0)
        heroes.sort((a, b) => b.minBeforeSummon - a.minBeforeSummon)


      if (sortOrder.stamina > 0)
        heroes.sort((a, b) => a.staminaFullIn - b.staminaFullIn)
      else if (sortOrder.stamina < 0)
        heroes.sort((a, b) => b.staminaFullIn - a.staminaFullIn)

      if (sortOrder.xp > 0)
        heroes.sort((a, b) => a.xp - b.xp)
      else if (sortOrder.xp < 0)
        heroes.sort((a, b) => b.xp - a.xp)

      if (sortOrder.floor > 0)
        heroes.sort((a, b) => a.floor.price - b.floor.price)
      else if (sortOrder.floor < 0)
        heroes.sort((a, b) => b.floor.price - a.floor.price)

      return heroes
    },
    totalFloor() {
      const heroes = this.heroes()

      if(heroes.length < 0)
        return 0

      let total = 0
      for(const hero of heroes)
        total += hero.floor.price

      return total
    }
  },
  methods: {
    formatNumber(num, prefix, suffix, decimals) {
      return formatNumber(num, prefix, suffix, decimals)
    },
    cap(str) {
      return capitalize(str)
    },
    toggleSort(field) {
      let currentDir = this.heroSort[field]

      if (currentDir === 0)
        currentDir = -1

      this.heroSort = {...defaultSort}

      this.heroSort[field] = currentDir * -1
      console.info(this.heroSort)
    }
  },
  provide() {
    return {
      sortToggle: (field) => this.toggleSort(field)
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
