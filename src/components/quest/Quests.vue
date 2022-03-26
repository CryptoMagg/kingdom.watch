<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>Quests done by
          <Address :address="userAddress"/>
        </h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a @click="activeTab = 'quest'"
               class="nav-link"
               :class="{active: activeTab === 'quest'}"
               aria-current="page"
               href="#">By Quests</a>
          </li>
          <li class="nav-item">
            <a @click="activeTab = 'hero'"
               class="nav-link"
               :class="{active: activeTab === 'hero'}"
               href="#">By Hero</a>
          </li>
          <li class="nav-item">
            <a @click="activeTab = 'total'"
               class="nav-link"
               :class="{active: activeTab === 'total'}"
               href="#">Total</a>
          </li>
        </ul>
      </div>
    </div>

    <QuestsByQuest v-if="activeTab === 'quest'"/>
    <QuestsByHero v-if="activeTab === 'hero'"/>
    <QuestsTotal v-if="activeTab === 'total'" />

  </div>
</template>

<script>
import axios from "axios";

import {getAllItemAddresses, getItem} from "@/utils/Items";
import Address from "@/components/generic/Address";
import QuestsByQuest from "@/components/quest/QuestsByQuest";
import QuestsByHero from "@/components/quest/QuestsByHero";
import QuestsTotal from "@/components/quest/QuestsTotal";

export default {
  name: "Quests",
  components: {QuestsTotal, QuestsByHero, QuestsByQuest, Address},
  data() {
    return {
      userAddress: "",
      userQuests: [],
      activeTab: "quest",
    }
  },
  computed: {
    quests() {
      if (!this.userQuests["quests"])
        return []

      const quests = []

      for (let quest of this.userQuests.quests) {
        const q = {
          rewards: [],
          ...quest
        }

        if (quest.timestamp)
          q["time"] = new Date(quest.timestamp * 1000).toISOString()
        else
          q.timestamp = 0

        const itemAddresses = getAllItemAddresses()
        for (let itemAddress of itemAddresses) {

          let decimals = 1
          if(itemAddress === "0x72cb10c6bfa5624dd07ef608027e366bd690048f")
            decimals = 1e18
          else if(itemAddress === "0x3a4EDcf3312f44EF027acfd8c21382a5259936e7".toLowerCase())
            decimals = 1e3

          if (quest[itemAddress])
            q.rewards.push(
                {
                  item: getItem(itemAddress),
                  amount: quest[itemAddress] / decimals
                })
        }

        quests.push(q)
      }

      quests.sort((a, b) => b.timestamp * 1 - a.timestamp * 1)

      return quests
    },
    heroes() {
      if (!this.userQuests["heroes"])
        return []

      const heroes = []

      for (let hero of this.userQuests.heroes) {
        const h = {
          rewards: [],
          heroId: hero.heroId,
          xp: hero.xp,
          staminaSpent: hero.staminaSpent
        }

        for (let reward of hero.rewards) {
          if (reward.item === "0x0000000000000000000000000000000000000000")
            continue

          let decimals = 1
          if(reward.item === "0x72cb10c6bfa5624dd07ef608027e366bd690048f")
            decimals = 1e18
          else if(reward.item === "0x3a4EDcf3312f44EF027acfd8c21382a5259936e7".toLowerCase())
            decimals = 1e3

          h.rewards.push({
            item: getItem(reward.item),
            amount: reward.amount / decimals
          })
        }

        console.info(h)

        heroes.push(h)
      }

      heroes.sort((a, b) => a.heroId - b.heroId)

      return heroes
    },
    totals() {
      if (!this.userQuests["heroes"]) {
        return []
      }

      const totalAmount = {}

      for (let hero of this.userQuests.heroes) {
        for (let reward of hero.rewards) {
          if (reward.item === "0x0000000000000000000000000000000000000000")
            continue

          let decimals = 1
          if(reward.item === "0x72cb10c6bfa5624dd07ef608027e366bd690048f")
            decimals = 1e18
          else if(reward.item === "0x3a4EDcf3312f44EF027acfd8c21382a5259936e7".toLowerCase())
            decimals = 1e3

          if (!totalAmount[reward.item])
            totalAmount[reward.item] = reward.amount / decimals
          else
            totalAmount[reward.item] += reward.amount / decimals
        }
      }

      const totals = []

      for(const [item, amount] of Object.entries(totalAmount)) {
        totals.push({
          amount,
          item: getItem(item)
        })
      }
      console.info(totals)
      return totals
    }
  },
  methods: {
    professionString(professionId) {
      const professions = {
        "-1": "",
        "2": "Gardening",
        "4": "Fishing",
        "6": "Foraging"
      }

      return professions[professionId]
    },
    async loadQuests() {
      axios.get(`https://us-east1-dfkwatch-328521.cloudfunctions.net/playerQuests?userAddress=${this.userAddress}`)
          .then(response => {
            if (response.status === 200) {
              console.info(response.data)
              this.userQuests = response.data
            } else
              console.error(response.statusText)
          })
    }
  },
  provide() {
    return {
      quests: () => this.quests,
      heroes: () => this.heroes,
      totals: () => this.totals,

      professionString: (professionId) => this.professionString(professionId)
    }
  },
  created() {
    if (this.$route.params.userAddress) {
      this.userAddress = this.$route.params.userAddress
      this.loadQuests()
    }
  },
}
</script>

<style scoped>

</style>
