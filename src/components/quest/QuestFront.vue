<template>
  <div class="container">
    <div class="row">
      <div class="col-auto m-auto">
        <h3>Load your new quest log</h3>
        <form @submit.prevent="redirectNew" class="needs-validation">
          <label :class="{'is-invalid': addressInvalid}" for="address" class="form-label">
            Please paste your 0x address in the box below, and press enter or click load
          </label>
          <br/>
          <input
              id="addressNew"
              type="text"
              placeholder="Your 0x address"
              v-model="userAddress"
              required
              :class="{'is-invalid': addressInvalid}"
              class="form-control w-50 m-auto"
          />
          <br/>
          <button>{{ buttonText }}</button>
          <br />
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-auto m-auto">
        <h3>Load your old quest log</h3>
        <form @submit.prevent="redirect" class="needs-validation">
          <label :class="{'is-invalid': addressInvalid}" for="address" class="form-label">
            Please paste your 0x address in the box below, and press enter or click load
          </label>
          <br/>
          <input
              id="address"
              type="text"
              placeholder="Your 0x address"
              v-model="userAddress"
              required
              :class="{'is-invalid': addressInvalid}"
              class="form-control w-50 m-auto"
          />
          <br/>
          <button>{{ buttonText }}</button>
          <br />
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-auto m-auto p-3">
        <h3>Top 10 Greatest Tear pulls so far</h3>
        <p v-if="!greatestPulls.length">Loading..</p>
        <table class="table">
          <thead>
          <tr>
            <th>Time</th>
            <th>Tears</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="reward in greatestPulls" :key="reward">
            <td>{{ reward.time }}</td>
            <td>{{ reward.amount }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {mapGetters} from "vuex";

export default {
  name: "QuestFront",
  data() {
    return {
      userAddress: "",
      buttonText: "Load Quest log",
      addressInvalid: false,
      greatestPulls: []
    }
  },
  methods: {
    setUserAddress(event) {
      this.userAddress = event.target.value
      this.buttonText = "Load"
    },
    redirectNew() {
      if (this.userAddress.length === 42 && this.userAddress.substr(0, 2) === "0x") {
        this.buttonText = "Loading.."
        this.$router.push(`/quests/${this.userAddress}`)
      } else {
        this.addressInvalid = true
      }
    },
    redirect() {
      if (this.userAddress.length === 42 && this.userAddress.substr(0, 2) === "0x") {
        this.buttonText = "Loading.."
        this.$router.push(`/wishingwell/${this.userAddress}`)
      } else {
        this.addressInvalid = true
      }
    },
    loadQuestStats() {

      axios.get("https://us-east1-dfkwatch-328521.cloudfunctions.net/questStats")
      .then(response => {
        this.greatestPulls = []
        console.info(response)

        const questRewards = response.data.questRewards

        for(let reward of questRewards)
          this.greatestPulls.push({
            amount: reward.amount,
            time: new Date(reward.quest.timestamp * 1000).toISOString()
          })
      })
      .catch(err => console.error(err))
    }
  },
  computed: {
    ...mapGetters(["storeUserAddress"])
  },
  mounted() {
    this.userAddress = this.storeUserAddress
    this.loadQuestStats()
  }
}
</script>

<style scoped>

</style>