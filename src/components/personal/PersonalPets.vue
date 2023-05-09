<template>
  <div>
    <table class="table table-hover w-100">
     <thead>
     <tr>
      <th class="text-start">ID#</th>
      <th class="text-start">Chain</th>
      <th class="text-start">Rarity</th>
      <th class="text-end">Egg Type</th>
      <th class="text-end">Pet type</th>
      <th class="text-start">Element</th>
      <th class="text-start">Profession</th>
      <th class="text-start" colspan="2">Prof Bonus</th>
      <th class="text-start" colspan="2">Crafting Bonus</th>
      <th class="text-start">Combat Bonus</th>
      <th class="text-end"><router-link to="/about/floorprice">Floor</router-link></th>
      <th class="text-start"><router-link to="/about/floorprice">Confidence</router-link></th>
     </tr>
     </thead>
     <tbody>
       <tr v-for="pet of pets" :key="pet">
         <td class="text-start">{{ pet.id }}</td>
         <td class="text-start">{{ pet.chainName }}</td>
         <td class="text-start" :class="pet.rarityString">{{ pet.rarityString }}</td>
         <td class="text-end">{{ pet.eggString }}</td>
         <td class="text-end">{{ pet.displayName }}</td>
         <td class="text-start">{{ pet.elementName }}</td>
         <td class="text-start">{{ pet.profName }}</td>
         <td class="text-start">{{ pet.profBonus }}</td>
         <td class="text-start">{{ pet.profStars }}</td>
         <td class="text-start">{{ pet.craftName }}</td>
         <td class="text-start">{{ pet.craftBonus }}</td>
         <td class="text-start">{{ pet.combatBonus }}</td>
         <td class="text-end">{{ pet.floorPrice }}</td>
         <td class="text-end">{{ pet.floorConfidence }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th class="text-start"  colspan="11">{{ total }} Pets Total</th>
          <th class="text-end" >{{ floorTotal }}</th>
          <th class="text-end">{{ formatNumber(floorTotal * this.prices('cv'), '$') }}</th>
        </tr>
      </tfoot>
    </table>
  </div>
 </template>

 <script>

import formatNumber from "@/utils/FormatNumber";
import {queryPets} from "@/utils/Pets";


export default {
  name: "PersonalPets",
  props: ["userAddress"],
  inject: ["setPetTotal", "setPetNumberof", "prices"],
  data() {
    return {
      pets: [],
      total: 0,
      floorTotal:0
    }
  },
  methods: {
    formatNumber(num, prefix, suffix, decimals) {
      return formatNumber(num, prefix, suffix, decimals)
    },
    async fetchPets(){
    let petData = await queryPets(this.userAddress);
      this.pets = petData.pets;
      for(let expansion of ['sd','cv','sd2']){
        this.setPetNumberof(petData.count[expansion], expansion);
        this.total += petData.count[expansion];
        this.setPetTotal(petData.totals[expansion], expansion)
        this.floorTotal += petData.totals[expansion];
      }
    }
  },
  mounted() {
   //  this.fetchFloor()
    this.fetchPets();
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