<template>
  <div class="col-12 p-2">
    <h4>Selected hero</h4>
    <div v-if="hero.id">
      #{{ hero.id }}, {{ hero.name }}, Gen {{ hero.generation }} <span :class="hero.rarity">{{ hero.rarity }}</span>
      {{ hero.mainClass }}/{{ hero.subClass }} {{ hero.professionTitle }}
    </div>
  </div>
</template>

<script>
const professionTitles = {
  mining: "Miner",
  fishing: "Fisher",
  gardening: "Gardener",
  foraging: "Forager"
}

export default {
  name: "HeroTitle",
  inject: ["heroData"],
  computed: {
    hero() {
      const heroData = this.heroData()

      if (!heroData.id)
        return {}

      heroData["professionTitle"] = professionTitles[heroData.profession]

      return heroData
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