<template>
  <div class="container mb-3">
    <div class="row">
      <div class="col">

        <h1>Welcome to the <img :src="require('@/assets/dfk/logo.png')" alt="logo"/> <strong>Watch</strong>
        </h1>
        <figure>
          <blockquote class="blockquote">
            <p>Kingdoms gather, and now my watch begins.</p>
          </blockquote>
          <figcaption class="blockquote-footer">
            Someone on the <cite title="Internet">Internet</cite>
          </figcaption>
        </figure>
        <p class="text-end">皆さんこんにちは！いつもお世話になっております。ご利用いただき誠にありがとう御座います。</p>

        <p class="text-info bg-dark">Dark mode is enabled if your OS/mobile/browser is set to dark mode</p>

        <div class="row">
          <div class="col">
            <div class="text-light bg-dark navbar">
              <div class="col-3 nav-item">
                <router-link to="/dev" class="nav-link text-light ">Dev Watch</router-link>
              </div>
              <div class="col-3 nav-item">
                <router-link to="/bank" class="nav-link text-light ">Bank Watch</router-link>
              </div>
              <div class="col-3 nav-item">
                <router-link to="/hero" class="nav-link text-light ">Hero Watch</router-link>
              </div>
              <div class="col-3 nav-item">
                <router-link to="/personal" class="nav-link text-light ">Personal Watch</router-link>
              </div>
              <div class="col-3 nav-item">
                <router-link to="/quests" class="nav-link text-light ">Quest Watch</router-link>
              </div>
              <div class="col-3 nav-item">
                <router-link to="/epochs" class="nav-link text-light ">Epoch Watch</router-link>
              </div>
              <div class="col-3 nav-item">
                <router-link to="/feedback" class="nav-link text-light ">Feedback</router-link>&nbsp;
              </div>
              <div class="col-3 nav-item">
                <router-link to="/about" class="nav-link text-light">About</router-link>&nbsp;
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <nav class="navbar navbar-light bg-dark">
              <form @submit.prevent="setUserAddress(inputUserAddress)" class="container-fluid" >
                <div class="input-group">
                  <input v-model="inputUserAddress" type="text" class="form-control me-2" placeholder="Default address" aria-label="Default address"/>
                  <button class="btn btn-light">Set</button>
                </div>
              </form>
            </nav>
          </div>
        </div>

<!--        <p class="bg-dark text-warning p-2">-->
<!--          Just a friendly reminder: It's donations to the tip-jar that keeps this site running free of ads. :)-->
<!--          <span class="text-info" @click="copyTipJarToClipBoard" v-if="copied">Copied!</span>-->
<!--          <span class="text-info" @click="copyTipJarToClipBoard" v-else>[Click to copy tip-jar address]</span>-->
<!--        </p>-->

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: "Header",
  data() {
    return {
      copied: false,
      inputUserAddress: ""
    }
  },
  methods: {
    ...mapActions(["setUserAddress"]),
    copyTipJarToClipBoard() {
      navigator.clipboard.writeText("0x0e9fbabfac3a56d076b62d48964bd7bf057876d7")
      this.$gtag.event("CopyTipJarHeader")
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 5000)
    }

  },
  computed: {
    ...mapGetters(["storeUserAddress"])
  },
  mounted() {
    this.inputUserAddress = this.storeUserAddress
  }
}
</script>

<style scoped>

</style>