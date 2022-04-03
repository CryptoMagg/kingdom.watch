<template>
  <div>

    <table class="table table-hover w-100">
      <thead>
      <tr>
        <th class="text-start">ID#</th>
<!--        <th class="text-start">Hero</th>-->
        <th class="text-end">Gen</th>
        <th class="text-start">Rarity</th>
        <th class="text-start">Class</th>
        <th class="text-start">Profession</th>
        <th class="text-end"><router-link to="/about/floorprice">Floor</router-link></th>
        <th class="text-start"><router-link to="/about/floorprice">Confidence</router-link></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="hero of heroes" :key="hero">
        <td class="text-start">{{ hero.id }}</td>
<!--        <td />-->
<!--        <td class="text-start">{{ hero.info.firstName }} {{ hero.info.lastName }} </td>-->
        <td class="text-end">{{ hero.info.generation }}</td>
        <td class="text-start" :class="hero.rarityString">{{ hero.rarityString }}</td>
        <td class="text-start">{{ hero.classString }}</td>
        <td class="text-start">{{ hero.professionString }}</td>
        <td class="text-end">{{ formatNumber(hero.floorPrice, null, null, 0)}}</td>
        <td class="text-start">{{ hero.floorConfidence }}</td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td class="text-start" colspan="5">{{ heroes.length }} Heroes total. {{ priceStamp }}</td>
        <th class="text-end">{{ formatNumber(heroTotal)}}</th>
        <th />
      </tr>
      </tfoot>

    </table>
  </div>
</template>

<script>
import axios from "axios";
import formatNumber from "@/utils/FormatNumber";
import {getStatGenes, mainClass} from "@/utils/Heroes";

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

const auctionsContractJson = require("../../data/auctions.json")
const auctionsContractAddress = "0x13a65B9F8039E2c032Bc022171Dc05B30c3f2892"
const auctionsContract = hmy.contracts.createContract(auctionsContractJson.abi, auctionsContractAddress)

const rarity = ["Common", "Uncommon", "Rare", "Legendary", "Mythic"]


export default {
  name: "PersonalHeroes",
  props: ["userAddress"],
  inject: ["setHeroTotal", "setHeroProgress"],
  data() {
    return {
      heroes: [],
      floor: {},
      heroTotal: 0
    }
  },
  methods: {
    formatNumber(num, prefix, suffix, decimals) {
      return formatNumber(num, prefix, suffix, decimals)
    },
    async fetchHeroes() {
      this.heroes = []
      const heroIds = await heroesContract.methods.getUserHeroes(this.userAddress).call()

      const auctionHeroIds = await auctionsContract.methods.getUserAuctions(this.userAddress).call()

      const combinedHeroIds = heroIds.concat(auctionHeroIds)

      const heroCount = combinedHeroIds.length

      let processedHeroes = 0
      this.heroTotal = 0

      for (let heroId of combinedHeroIds) {
        const hero = await heroesContract.methods.getHero(heroId).call()

        const [statGenes, ] = getStatGenes(hero.info.statGenes)

        const floorData = this.floorPrice(hero, statGenes.profession)

        this.heroTotal += floorData.price

        hero["floorPrice"] = floorData.price
        hero["floorConfidence"] = floorData.confidence

        hero["rarityString"] = rarity[hero.info.rarity]
        hero["classString"] = mainClass[hero.info.class]
        hero["professionString"] = statGenes.profession.charAt(0).toUpperCase() + statGenes.profession.substring(1)

        if(!hero["classString"])
          // console.info(`Hero class ${hero.info.class}`)

        this.heroes.push(hero)
        // console.info(hero.info)
        processedHeroes++
        this.setHeroProgress(processedHeroes/heroCount * 100.0)
      }

      this.setHeroTotal(this.heroTotal)
      this.setHeroProgress(100)
    },

    async fetchFloor() {
      const response = await axios.get("https://us-east1-dfkwatch-328521.cloudfunctions.net/heroFloor")
          .catch(err => console.error(err))

      if (response.status !== 200)
          return console.error(response.statusText)

      this.floor = response.data

      await this.fetchHeroes()

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
      // console.info(id)
      if(!isNaN(this.floor[id]))
        return {
          confidence: generationString + ", R, " + summonsBucket + ", C, P",
          price: this.floor[id]
        }

      id = ids.slice(0, 4).join('-')
      // console.info(id)

      if(!isNaN(this.floor[id]))
        return {
          confidence: generationString + ", R, " + summonsBucket + ", C",
          price: this.floor[id]
        }


      id = ids.slice(0, 3).join('-')
      // console.info(id)

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
  computed: {
    priceStamp() {
      if(!this.floor.timestamp)
        return ""

      const date = new Date(this.floor.timestamp)

      return "Floor prices as of " + date.toISOString()
    }
  },
  mounted() {
    this.fetchFloor()
  }
}
</script>

<style scoped>

.Common {  }
.Uncommon { color: #14C25A }
.Rare { color: #21CCFF }
.Legendary { color: #ffa32d }
.Mythic { color: #df5bff }

</style>
