<template>
  <div class="container">
    <div class="row">
      <div class="col p-3">
        <h3 v-if="userAddress">Heroes of
          <Address :address="userAddress"/>
          <span v-if="profileName"> ({{ profileName }})</span>
        </h3>
        <h3 class="text-danger">BETA QUALITY</h3>
      </div>
    </div>
    <div class="row">
      <HeroTitle/>
    </div>
    <div class="row">
      <HeroStats/>
      <HeroProfession/>
      <HeroGenes/>
    </div>

    <div v-if="userAddress">
      <div class="row">
        <HeroList/>
      </div>
    </div>
    <div v-else>
      <div class="row p-3">
        <HeroLoadOther v-if="initialHeroId"/>
      </div>
      <div class="row">
        <HeroLeaderboards v-if="showLeaderboards"/>
      </div>
    </div>
  </div>
</template>

<script>
import {extractHeroData, getStatGenes, mainClass} from "@/utils/Heroes";
import HeroStats from "@/components/hero/HeroStats";
import HeroProfession from "@/components/hero/HeroProfession";
import HeroTitle from "@/components/hero/HeroTitle";
import Address from "@/components/generic/Address";
import HeroList from "@/components/hero/HeroList";
import axios from "axios";
import HeroLoadOther from "@/components/hero/HeroLoadOther";
import HeroLeaderboards from "@/components/hero/HeroLeaderboards";
import HeroGenes from "@/components/hero/HeroGenes";

const {Harmony} = require('@harmony-js/core');
const {
  ChainID,
  ChainType,
} = require('@harmony-js/utils');

const hmy = new Harmony(
    'https://harmony-0-rpc.gateway.pokt.network', //'https://api.harmony.one',
    {
      chainType: ChainType.Harmony,
      chainId: ChainID.HmyMainnet,
    },
);

const heroesContractJson = require("../../data/heroes.json")
const heroesContractAddress = "0x5f753dcdf9b1ad9aabc1346614d1f4746fd6ce5c"
const heroesContract = hmy.contracts.createContract(heroesContractJson.abi, heroesContractAddress)

const profileContractJson = require("../../data/profile.json")
const profileContractAddress = "0xabd4741948374b1f5dd5dd7599ac1f85a34cacdd"
const profileContract = hmy.contracts.createContract(profileContractJson.abi, profileContractAddress)

const auctionsContractJson = require("../../data/auctions.json")
const auctionsContractAddress = "0x13a65B9F8039E2c032Bc022171Dc05B30c3f2892"
const auctionsContract = hmy.contracts.createContract(auctionsContractJson.abi, auctionsContractAddress)

export default {
  name: "Hero",
  components: {HeroGenes, HeroLeaderboards, HeroLoadOther, HeroList, Address, HeroTitle, HeroProfession, HeroStats},
  data() {
    return {
      userAddress: "",
      profileName: "",
      initialHeroId: 0,
      heroData: {},
      heroes: [],
      floor: {},
      leaderboard: {},
      maxScores: {},
      showLeaderboards: true
    }
  },
  methods: {
    async loadLeaderboard() {
      const response = await axios.get("https://us-east1-dfkwatch-328521.cloudfunctions.net/getLeaderboard")
          .catch(err => console.error(err))

      if(response.status === 200) {
        const leaderBoard = response.data

        this.leaderboard = leaderBoard
        this.maxScores = {
          mining: leaderBoard["miners"][0].score,
          fishing: leaderBoard["fishers"][0].score,
          gardening: leaderBoard["gardeners"][0].score,
          foraging: leaderBoard["foragers"][0].score,
        }
      } else {
        console.error(`Got error while loading leaderboard ${response.status}`)
      }

    },
    async loadHeroes() {
      this.heroes = []

      const heroIds = await heroesContract.methods.getUserHeroes(this.userAddress).call()

      const auctionHeroIds = await auctionsContract.methods.getUserAuctions(this.userAddress).call()

      const combinedHeroIds = heroIds.concat(auctionHeroIds)

      this.heroTotal = 0

      for (let heroId of combinedHeroIds) {
        const heroData = await this.fetchHeroData(heroId)
        this.heroes.push(heroData)
      }
    },
    async fetchHeroData(heroId) {
      const hero = await heroesContract.methods.getHero(heroId).call()
      console.info(hero)
      const heroData = extractHeroData(hero, this.maxScores)

      const [statGenes,] = getStatGenes(hero.info.statGenes)
      heroData["floor"] = this.floorPrice(hero, statGenes.profession)

      if (!heroData["mainClass"])
        console.info(`Hero class ${hero.info.class}`)
      console.info(heroData)
      return heroData
    },
    async loadHero(heroId) {

      const heroData = await this.fetchHeroData(heroId)

      console.info(heroData)
      this.heroData = heroData
    },
    async fetchFloor(loadHeroes) {
      const response = await axios.get("https://us-east1-dfkwatch-328521.cloudfunctions.net/heroFloor")
          .catch(err => console.error(err))

      if (response.status !== 200)
        return console.error(response.statusText)

      this.floor = response.data

      if(loadHeroes)
        await this.loadHeroes()

    },
    floorPrice(hero, profession) {
      let info = hero.info

      let generation = info.generation * 1
      let generationString = "G" + generation

      if(generation >= 4) {
        generation = 4
        generationString = "G4+"
      }

      let maxSummons = hero.summoningInfo.maxSummons
      if(maxSummons === 'a')
        maxSummons = 10

      let summonsBucket = "S0"
      let summonsLeft = maxSummons - hero.summoningInfo.summons

      if(generation === 0)
        summonsBucket = "Si"
      else if(summonsLeft >= 8)
        summonsBucket = "S8+"
      else if(summonsLeft >= 5)
        summonsBucket = "S5-7"
      else if(summonsLeft >= 1)
        summonsBucket = "S1-4"


      let ids = [generation, info.rarity, summonsBucket, mainClass[info.class], profession]

      let id = ids.join('-')
      console.info(id)
      if(!isNaN(this.floor[id]))
        return {
          confidence: generationString + ", R, " + summonsBucket + ", C, P",
          price: this.floor[id]
        }

      id = ids.slice(0, 4).join('-')
      console.info(id)

      if(!isNaN(this.floor[id]))
        return {
          confidence: generationString + ", R, " + summonsBucket + ", C",
          price: this.floor[id]
        }


      id = ids.slice(0, 3).join('-')
      console.info(id)

      if(!isNaN(this.floor[id]))
        return {
          confidence: generationString + ", R, " + summonsBucket,
          price: this.floor[id]
        }

      id = ids.slice(0, 2).join('-')
      if(!isNaN(this.floor[id]))
        return {
          confidence: generationString + ", R",
          price: this.floor[id]
        }

      id = ids[0]
      if(!isNaN(this.floor[id]))
        return {
          confidence: generationString,
          price: this.floor[id]
        }

      return {
        confidence: "None",
        price: 0
      }
    },
  },
  provide() {
    return {
      heroData: () => this.heroData,
      heroes: () => this.heroes,
      loadHero: (id) => this.loadHero(id),

      leaderboard: () => this.leaderboard,
      professionLeaders: () => this.maxScores,

      priceStamp: () => {
        if (!this.floor.timestamp)
          return ""

        const date = new Date(this.floor.timestamp)

        return "Floor prices as of " + date.toISOString()
      },
    }
  },
  created() {
    const id = this.$route.params.id

    this.userAddress = ""
    this.initialHeroId = 0

    if (id.length < 10 && !isNaN(id)) {
      this.initialHeroId = id * 1
    } else if (id) {
      this.userAddress = id
    }
  },
  mounted() {

    this.loadLeaderboard()

    if (this.userAddress.length > 0) {
      profileContract.methods.getProfileByAddress(this.userAddress)
          .call()
          .then(profile => {
            this.profileName = profile._name
          })

      this.fetchFloor(true)
    } else {
      this.fetchFloor(false)
    }

    if (this.initialHeroId)
      this.loadHero(this.initialHeroId)

  }

}
</script>

<style scoped>

</style>
