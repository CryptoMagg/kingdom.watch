<template>
  <div>
    <table class="table table-hover w-100">
      <thead>
      <tr>
        <th class="text-start">ID#</th>
        <th class="text-end">Gen</th>
        <th class="text-end">Level</th>
        <th class="text-start">Rarity</th>
        <th class="text-start">Class</th>
        <th class="text-start">Profession</th>
        <th class="text-start">Boosts</th>
        <th class="text-start">Summons</th>
        <th class="text-end"><router-link to="/about/floorprice">Floor</router-link></th>
        <th class="text-start"><router-link to="/about/floorprice">Confidence</router-link></th>
      </tr>
      </thead>
      <tbody v-for="[symbol, expansion] of [['Serendale', 'sd'], ['Crystalvale', 'cv'], ['Serendale 2.0', 'sd2']]" :key="symbol">
        <tr>
          <th>{{ symbol }} </th>
          <td class="text-start" colspan="7">{{ heroes[expansion].length }} Heroes total. {{ priceStamp }}</td>
          <th class="text-end"><img src="@/assets/dfk/crystal-logo.b0ad245d.png" style="width:22px !important"/><span>{{ formatNumber(heroTotal[expansion])}}</span></th>
          <th/>
        </tr>
        <tr v-for="hero of heroes[expansion]" :key="hero">
          <td class="text-start">{{ hero.id }}</td>
          <td class="text-end">{{ hero.generation }}</td>
          <td class="text-end">{{ hero.level }}</td>
          <td class="text-start" :class="hero.rarityString">{{ hero.rarityString }}</td>
          <td class="text-start">{{ hero.classString }}</td>
          <td class="text-start">{{ hero.professionString }}</td>
          <td class="text-start d-flex"><div class="Uncommon">{{  hero.statBoost1String }}</div> / <div class="Rare">{{ hero.statBoost2String }}</div></td>
          <td class="text-start">{{ hero.maxSummons == 11 ? hero.summons :  hero.summonsRemaining }}/{{ hero.maxSummons == 11 ? "∞" : hero.maxSummons }}</td>
          <td class="text-end">{{ formatNumber(hero.floorPrice, null, null, 0)}}</td>
          <td class="text-start">{{ hero.floorConfidence }}</td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script>
import axios from "axios";
import formatNumber from "@/utils/FormatNumber";
import {rarity, mainClass, choices, queryHeros, professionsMap, findHeroKey} from "@/utils/Heroes";

import { expansionSet, expansionObjSet, expansionArraySet} from "@/utils/ethers";


const networkMap = {
  "hmy": "sd",
  "dfk": "cv",
  "kla": "sd2"
}

export default {
  name: "PersonalHeroes",
  props: ["userAddress"],
  inject: ["setHeroTotal", "setHeroProgress","setHeroNumberof"],
  data() {
    return {
      heroes: {...expansionArraySet},
      floor: {...expansionObjSet},
      heroTotal: {...expansionSet},
    heroNumberof:{...expansionSet}
    }
  },
  methods: {
    formatNumber(num, prefix, suffix, decimals) {
      return formatNumber(num, prefix, suffix, decimals)
    },
    async fetchHeroes() {
      const heroKeySet = [];

      for(let expansion in expansionSet){
        this.heroTotal[expansion] = 0;
        this.heroes[expansion] = [];
      }
      
      let queryresults = await queryHeros(this.userAddress);

      const heroCount = queryresults.heroes.length;

      let processedHeroes = 0
      
      for(let heroData of queryresults.heroes){
        let hero = {...heroData};
        // console.log(JSON.stringify(hero));
        //set expansion
        hero.expansion = networkMap[hero.network];
        // map values to user friendly strings
        hero.rarityString = rarity[hero.rarity];
        hero.classString = mainClass[hero.mainClass];
        hero.professionString = professionsMap[hero.profession];
        hero.statBoost1String = choices.statBoost1[hero.statBoost1];
        hero.statBoost2String = choices.statBoost2[hero.statBoost2];

        //defaults for floor data
        hero.floorPrice = 0;
        hero.confidence = 'None';
        //if for sale show that as value rather than floor
        if(hero.salePrice) hero.floorPrice = hero.salePrice;
       
        //add to set for aggregated query
        hero.heroKey = findHeroKey(hero);
        heroKeySet.push(hero.heroKey);

        // console.log(JSON.stringify(hero));
        this.heroes[hero.expansion].push(hero)

        processedHeroes++
        
      }
      for(let expansion of ["sd","cv","sd2"]){
        
        this.setHeroProgress(processedHeroes/heroCount * 100.0, expansion);
        this.setHeroNumberof(this.heroes[expansion].length, [expansion])
      }
      
    this.fetchFloors(heroKeySet);
    },

  async fetchFloors(keys){
    const response = await axios.post("https://dfk-floor-api.ew.r.appspot.com/herofloorBulk" 
                            , {"keys": keys} ,
                            {	headers: {
                                "Content-Type": "application/json",
                                'Access-Control-Allow-Origin': '*',
                              },
                            }
                          ).catch(err => console.error(err))
                          
      for(let expansion of ['sd', 'cv', 'sd2']){
        this.heroes[expansion].forEach(hero => {
          hero.floorPrice = response.data[hero.heroKey].floorPrice;
          hero.floorConfidence = response.data[hero.heroKey].confidence;
          this.heroTotal[expansion] += hero.floorPrice;
        });
        this.setHeroTotal(this.heroTotal[expansion], [expansion])
        this.setHeroProgress(100, [expansion])
      }
  },
  },
  computed: {
    priceStamp() {
      if(!this.floor.sd.timestamp)
        return ""

      const date = new Date(this.floor.sd.timestamp)

      return "Floor prices as of " + date.toISOString()
    }
  },
  mounted() {
   //  this.fetchFloor()
    this.fetchHeroes();
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
