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
import {extractHeroData, getStatGenes, queryHeros, professionsMap, rarity, mainClass, findHeroKey} from "@/utils/Heroes";
import HeroStats from "@/components/hero/HeroStats";
import HeroProfession from "@/components/hero/HeroProfession";
import HeroTitle from "@/components/hero/HeroTitle";
import Address from "@/components/generic/Address";
import HeroList from "@/components/hero/HeroList";
import axios from "axios";
import HeroLoadOther from "@/components/hero/HeroLoadOther";
import HeroLeaderboards from "@/components/hero/HeroLeaderboards";
import HeroGenes from "@/components/hero/HeroGenes";
import {contracts} from "@/utils/ethers";

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

// const heroesContractJson = require("../../data/heroes.json")
// const heroesContractAddress = "0x5f753dcdf9b1ad9aabc1346614d1f4746fd6ce5c"
// const heroesContract = hmy.contracts.createContract(heroesContractJson.abi, heroesContractAddress)
const heroesContract = contracts.cv.hero

const profileContractJson = require("../../data/profile.json")
const profileContractAddress = "0xabd4741948374b1f5dd5dd7599ac1f85a34cacdd"
const profileContract = hmy.contracts.createContract(profileContractJson.abi, profileContractAddress)

// const auctionsContractJson = require("../../data/auctions.json")
// const auctionsContractAddress = "0x13a65B9F8039E2c032Bc022171Dc05B30c3f2892"
// const auctionsContract = hmy.contracts.createContract(auctionsContractJson.abi, auctionsContractAddress)
// const auctionsContract = contracts.cv.auction

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
      // const response = await axios.get("https://us-east1-dfkwatch-328521.cloudfunctions.net/getLeaderboard")
      //     .catch(err => console.error(err))
      //
      // if(response.status === 200) {
      //   const leaderBoard = response.data
      //
      //   this.leaderboard = leaderBoard
      //   this.maxScores = {
      //     mining: leaderBoard["miners"][0].score,
      //     fishing: leaderBoard["fishers"][0].score,
      //     gardening: leaderBoard["gardeners"][0].score,
      //     foraging: leaderBoard["foragers"][0].score,
      //   }
      // } else {
      //   console.error(`Got error while loading leaderboard ${response.status}`)
      // }

    },
    async loadHeroes() {
      this.heroes = [];
			const heroKeySet = [];

			let queryresults = await queryHeros(this.userAddress);
			
			this.heroTotal = 0;

			for(let heroData of queryresults.heroes){
				let hero = {...heroData};

				hero.rarityString = rarity[hero.rarity];
				hero.classString = mainClass[hero.mainClass];
				hero.professionString = professionsMap[hero.profession];
				
				hero["minBeforeSummon"] = ((hero.nextSummonTime.valueOf() * 1000  - Date.now()) / 60000).toFixed(0);
				hero["staminaFullIn"] = ((hero.staminaFullAt * 1000 - Date.now()) / 60000).toFixed(0)
				hero["name"] = hero.firstName + " " + hero.lastName;
				hero["bestProfession"] = "-";
				hero["bestProfessionScore"] = 0;
				hero["bestRelativeScore"] = 0;
				hero["bestRelativeProfession"] = "-";

				hero["floorPrice"] = 0;
				hero.heroKey = findHeroKey(hero);
				heroKeySet.push(hero.heroKey);
				
        this.heroes.push(hero);
			}
			this.fetchFloors(heroKeySet);

    },
		async fetchFloors(keys){
		const response = await axios.post("http://34.141.228.218:8081/herofloorBulk" 
														, {"keys": keys} ,
														{	headers: {
																"Content-Type": "application/json",
																'Access-Control-Allow-Origin': '*',
															},
														}
													).catch(err => console.error(err));
				this.heroes.forEach(hero => {
					hero.floorPrice = response.data[hero.heroKey].floorPrice;
					hero.floorConfidence = response.data[hero.heroKey].confidence;
					this.heroTotal += hero.floorPrice;
				});
	},
    async fetchHeroData(heroId) {
      const hero = await heroesContract.getHero(heroId)
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
    // async fetchFloor(loadHeroes) {
    //   const response = await axios.get("https://us-east1-dfkwatch-328521.cloudfunctions.net/heroFloor")
    //       .catch(err => console.error(err))

    //   if (response.status !== 200)
    //     return console.error(response.statusText)

    //   this.floor = response.data

    //   if(loadHeroes)
    //     await this.loadHeroes()

    // },
    floorPrice(hero, profession) {
      console.log(`Not getting the floor price of ${hero} profession ${profession}`)
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

    if (id.length < 14 && !isNaN(id)) {
      this.initialHeroId = id * 1
    } else if (id) {
      this.userAddress = id
    }
  },
  mounted() {

   //  this.loadLeaderboard()

    if (this.userAddress.length > 0) {
      profileContract.methods.getProfileByAddress(this.userAddress)
          .call()
          .then(profile => {
            this.profileName = profile._name
          })

      // this.fetchFloor(true)
			this.loadHeroes()

    } else {
      // this.fetchFloor(false)
    }

    if (this.initialHeroId)
      this.loadHero(this.initialHeroId)

  }

}
</script>

<style scoped>

</style>
