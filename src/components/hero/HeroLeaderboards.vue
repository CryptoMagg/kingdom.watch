<template>
  <HeroLeaderboard profession="miners" />
  <HeroLeaderboard profession="fishers" />
  <HeroLeaderboard profession="gardeners" />
  <HeroLeaderboard profession="foragers" />

  <p class="text-start">Currently indexing heroes up to id {{ this.leaderboard().maxHeroId }}.</p>
</template>

<script>
import HeroLeaderboard from "@/components/hero/HeroLeaderboard";

export default {
  name: "HeroLeaderboards",
  components: {HeroLeaderboard},
  inject: ["leaderboard"]
}
</script>

<style scoped>

</style>