<template>
  <div class="container">
    <div class="row">
      <div class="m-auto col-auto">
        <button @click="fetchRewards">Fetch Quest history</button>
        <input v-model="userAddress" placeholder="0x format address"/>
        <br/>
        <br/>
        <p v-if="totalXp > 0">
          You've received a total of {{ totalTears }} Tears and {{ totalXp }} XP from the Wishing Well.
        </p>
        <p v-if="error.length > 0" class="text-danger bg-dark">{{ error }}</p>

        <p v-if="mostRecentEntryStamp > 0">The most recent quest record is dated {{ mostRecentEntryTime }}</p>

        <div class="col-8 col-sm-6 col-md-4 p-3">
          <div class="form-check form-switch">
            <input v-model="listByHeroes" class="form-check-input" type="checkbox" role="switch"
                   id="flexSwitchCheckDefault">
            <label class="form-check-label" for="flexSwitchCheckDefault">List quests by hero</label>
          </div>
        </div>

      </div>
    </div>
    <div v-if="listByHeroes" class="row">
      <template v-for="heroData in heroes" :key="heroData.id">
        <div class="col-sm-6 col-md-4 col-xl-3">
          <h4>Hero {{ heroData.id }} <span v-if="!heroData.currentlyOwned">(sold)</span></h4>
          <!--          <p>{{ heroData.quests.length }} quests:</p>-->
          <p>{{ heroData.tears }} Tears / {{ heroData.xp }} XP</p>
          <table class="table">
            <thead>
            <tr>
              <th>Time (UTC)</th>
              <th>XP</th>
              <th>Tears</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="quest of heroData.quests" :key="quest">
              <td>{{ quest.time }}</td>
              <td>{{ quest.xp }}</td>
              <td>{{ quest.tears }}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </template>
    </div>
    <div v-if="!listByHeroes" class="row">
      <div class="col-md-6 m-auto">
      <table class="m-auto table table-hover">
        <thead>
        <tr>
          <th>Time</th>
          <th>Hero</th>
          <th>XP</th>
          <th>Tears</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="quest in quests" :key="quest">
          <tr>
            <td>{{ quest.time }}</td>
            <td>{{ quest.hero }}</td>
            <td>{{ quest.xp }}</td>
            <td>{{ quest.tears }}</td>
          </tr>

        </template>
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WishingWell",
  data() {
    return {
      userAddress: "",
      quests: [],
      heroes: {},
      totalTears: 0,
      totalXp: 0,
      mostRecentEntryStamp: 0,
      error: "",
      listByHeroes: false,
    }
  },
  computed: {
    mostRecentEntryTime() {
      return new Date(this.mostRecentEntryStamp * 1000).toISOString()
    }
  },
  methods: {
    async fetchRewards() {

      axios.post(`https://us-east1-dfkwatch-328521.cloudfunctions.net/getQuestRewards?userAddress=${this.userAddress}`) // "http://localhost:7000/?userAddress=0x007d621a3ce1445110e1a4ae45e7f3d5228ac0c1")
          .then(response => {
            console.info(response)
            this.processResult(response.data)
            this.error = ""
          })
          .catch(err => {
            this.error = "Error fetching heroes. The index might be rebuilding, or perhaps you gave an invalid address? Must be starting with 0x"
            console.error(err)
          })

    },
    processResult(data) {
      this.mostRecentEntryStamp = 0
      this.quests = []
      this.heroes = {}

      let totalTears = 0, totalXp = 0
      const tmpHeroes = {}

      console.log(data)

      const inputQuests = data.sort((a, b) => b.timestamp * 1 - a.timestamp * 1)

      for (let quest of inputQuests) {
        totalXp += quest.xpEarned * 1

        if (quest.timestamp > this.mostRecentEntryStamp)
          this.mostRecentEntryStamp = quest.timestamp * 1

        let questTears = 0

        for (let reward of quest.questRewards) {
          if (reward.id.endsWith("0x24ea0d436d3c2602fbfefbe6a16bbc304c963d04")) {
            questTears += reward.amount * 1
            totalTears += reward.amount * 1
          }
        }

        if (!tmpHeroes[quest.hero.id]) {
          tmpHeroes[quest.hero.id] = {
            id: quest.hero.id,
            tears: 0,
            xp: 0,
            currentlyOwned: (quest.hero.currentPlayer.id === this.userAddress.toLowerCase()),
            quests: []
          }
        }

        tmpHeroes[quest.hero.id]["tears"] += questTears
        tmpHeroes[quest.hero.id]["xp"] += quest.xpEarned * 1

        const timeIsoString = new Date(quest.timestamp * 1000).toISOString()
        const shortDate = timeIsoString.split('T')[0]
        const shortTime = timeIsoString.split('T')[1].substr(0, 5)

        tmpHeroes[quest.hero.id]["quests"].push({
          questId: quest.id,
          time: `${shortDate} ${shortTime}`,
          xp: quest.xpEarned * 1,
          tears: questTears,
        })

        this.quests.push({
          timestamp: quest.timestamp,
          time: timeIsoString,
          hero: quest.hero.id,
          xp: quest.xpEarned,
          tears: questTears
        })

      }

      console.log(tmpHeroes)
      this.heroes = tmpHeroes
      this.totalTears = totalTears
      this.totalXp = totalXp

    },
  },
  created() {
    if (this.$route.params.userAddress) {
      this.userAddress = this.$route.params.userAddress
      this.fetchRewards()

    }
  },
}
</script>

<style scoped>

</style>