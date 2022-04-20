<template>
  <div class="p-3">
    <div class="container">
      <p>
        <em>Please contact <strong>Magg</strong> in the DFK Discord or use the
          <router-link to="/feedback">feedback</router-link>
          form for feedback and/or suggestions
          (EU TZ)</em>
      </p>
    </div>

    <div class="container">
      Tip jar: <span class="font-monospace">{{ tipJar }}</span>&nbsp;
      <span @click="copyTipJarToClipBoard" v-if="copied">Copied!</span>
      <span @click="copyTipJarToClipBoard" v-else>[Click to copy]</span>
      <br/>
      You can also <span class="font-monospace">/tip</span> on Discord :) My nickname is <em>@Magg | Kingdom.Watch</em>.
      <br />
      <em>(Oh, wow! I've actually gotten some tips! Thank you so much!)</em><br/>
    </div>

    <!--<div class="container">
      <br/>
      Twitter: <a @click="trackClick('Twitter')" target="_blank" href="https://twitter.com/KingdomWatchDFK">https://twitter.com/KingdomWatchDFK</a><br/>
    </div>-->

    <div class="container">
      <br/>
      <router-link to="/about">About this page</router-link>
      <br/>
    </div>


  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      tipJar: "0x0e9fbabfac3a56d076b62d48964bd7bf057876d7",
      copied: false,
    }
  },
  methods: {
    trackClick(dest) {
      this.$gtag.event(`FollowLink_${dest}`)
    },
    copyTipJarToClipBoard() {
      navigator.clipboard.writeText(this.tipJar)
      this.$gtag.event("CopyTipJar")
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 5000)
    }
  }

}
</script>

<style scoped>

</style>
