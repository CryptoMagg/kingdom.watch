<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <h3>By User Address</h3>
        <form @submit.prevent="redirectAddress" class="needs-validation">
          <label :class="{'is-invalid': addressInvalid}" for="address" class="form-label">
            Please paste your address in the box below
          </label>
          <br/>
          <input
              id="address"
              type="text"
              placeholder="Your address"
              v-model="userAddress"
              required
              :class="{'is-invalid': addressInvalid}"
              class="form-control w-75 m-auto"
          />
          <br/>
          <button>{{ buttonText }}</button>
        </form>
      </div>
      <div class="col-6">
        <h3>By Hero ID</h3>
        <form @submit.prevent="redirectHero" class="needs-validation">
          <label :class="{'is-invalid': heroIdInvalid}" for="heroId" class="form-label">
            Please paste the hero id in the box below
          </label>
          <br/>
          <input
              id="heroId"
              type="text"
              placeholder="Hero id"
              v-model="heroId"
              required
              :class="{'is-invalid': heroIdInvalid}"
              class="form-control w-50 m-auto"
          />
          <br/>
          <button>{{ buttonText }}</button>
        </form>
      </div>
    </div>
    <div class="row">
      <h4 class="col p-4">
        Just take me to the <router-link to="/hero/0">LEADERBOARD</router-link>
      </h4>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "HeroFront",
  data() {
    return {
      userAddress: "",
      heroId: "",
      buttonText: "Load",
      addressInvalid: false,
      heroIdInvalid: false,
    }
  },
  methods: {
    redirectAddress() {
      if (this.userAddress.length === 42
          && (this.userAddress.substr(0, 2) === "0x" || this.userAddress.substr(0, 3) === "one")) {
        this.buttonText = "Loading.."
        this.$router.push(`/hero/${this.userAddress}`)
      } else {
        this.addressInvalid = true
      }
    },
    redirectHero() {
      if (this.heroId.length < 14 && !isNaN(this.heroId)) {
        this.buttonText = "Loading.."
        this.$router.push(`/hero/${this.heroId}`)
      } else {
        this.heroIdInvalid = true
      }
    }
  },
  computed: {
    ...mapGetters(["storeUserAddress"])
  },
  mounted() {
    this.userAddress = this.storeUserAddress
  }
}
</script>

<style scoped>

</style>
