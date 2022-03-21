<template>
  <div>
    <form @submit.prevent="redirect" class="needs-validation">
      <label :class="{'is-invalid': addressInvalid}" for="address" class="form-label">
        Please paste your address in the box below, and press enter or click load
      </label>
      <br/>
      <input
          id="address"
          type="text"
          placeholder="Your address"
          v-model="userAddress"
          required
          :class="{'is-invalid': addressInvalid}"
          class="form-control w-50 m-auto"
      />
      <br />
      <button>{{ buttonText }}</button>
    </form>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "PersonalFront",
  data() {
    return {
      userAddress: "",
      buttonText: "Load",
      addressInvalid: false
    }
  },
  methods: {
    setUserAddress(event) {
      this.userAddress = event.target.value
      this.buttonText = "Load"
    },
    redirect() {
      if (this.userAddress.length === 42
          && (this.userAddress.substr(0, 2) === "0x" || this.userAddress.substr(0, 3) === "one")) {
        this.buttonText = "Loading.."
        this.$router.push(`/personal/${this.userAddress}`)
      } else {
        this.addressInvalid = true
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