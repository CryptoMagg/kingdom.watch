<template>
  <div class="col p-2">
    <form @submit.prevent="loadOtherHero" class="needs-validation">
      <label :class="{'is-invalid': heroIdInvalid}" for="otherHeroId" class="form-label">
        Type another Hero Id in the box and press enter or click load
      </label>
      <input
          id="otherHeroId"
          type="text"
          placeholder="Other Hero Id"
          v-model="otherHeroId"
          required
          :class="{'is-invalid': heroIdInvalid}"
          class="form-control w-25 m-auto"
      />
      <br/>
      <button>{{ buttonText }}</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "HeroLoadOther",
  inject: ["loadHero"],
  data() {
    return {
      otherHeroId: "",
      buttonText: "Load",
      heroIdInvalid: false
    }
  },
  methods: {
    loadOtherHero() {
      if (!isNaN(this.otherHeroId)) {
        this.loadHero(this.otherHeroId)
      } else {
        this.heroIdInvalid = true
      }
    }
  }
}
</script>

<style scoped>

</style>