import { GraphQLClient, gql } from 'graphql-request';
import axios from "axios";

const greyEggData = require("@/data/greyEggData.json");
const blueEggData = require("@/data/blueEggData.json");



const graphqlapiUrl = 'https://defi-kingdoms-community-api-gateway-co06z8vi.uc.gateway.dev/graphql';

const petQuery =  
      gql`
        query getPets($ownerAddress: String!){
          pets(
          where: {
            owner: $ownerAddress
          }) {
            id
            appearance
            rarity
            element
            profBonus
            craftBonus
            combatBonus
            eggType
            originRealm
          }
        }`;

const chainMap = {
                "SER1": "sd",
                "CRY":  "cv",
                "SER2": "sd2"
              }
              export const Rarity = {
                0: "Common",
                1: "Uncommon",
                2: "Rare",
                3: "Legendary",
                4: "Mythic"
              };

const petElements = {
          0: "Fire",
          1: "Water",
          2: "Earth",
          3: "Wind",
          4: "Lightning",
          5: "Ice",
          6: "Light",
          7: "Dark"
        };

const eggType = {
          0: "Blue Egg",
          1: "Grey Egg",
          2: "Green Egg",
          3: "Yellow Egg",
          4: "Golden Egg"
        };

const bonuses = {
  0:   "-",
  1:   "★",
  80:  "★★",
  160: "★★★"
};

const bonusStars = {
   0:   "★",
   1:  "★★",
   2: "★★★"
};

const craftingTypes = {  
  0: "Blacksmithing",
  1: "Goldsmithing",
  2: "Armorsmithing",
  3: "Woodworking",
  4: "Leatherworking",
  5: "Tailoring",
  6: "Enchanting",
  7: "Alchemy"
}

const professions =  {
  0: "Fishing",
  1: "Foraging",
  2: "Gardening",
};

const gatheringBonuses = {
  // Blue Pet Bonuses
  0: { 
     1: "Unrevealed",
     80: "Unrevealed",
     160: "Unrevealed",
     2: "Efficient Angler",
     81: "Efficient Angler",
     161: "Efficient Angler",
     3: "Bountiful Catch",
     82: "Bountiful Catch",
     162: "Bountiful Catch",
     4: "Keen Eye",
     83: "Keen Eye",
     163: "Keen Eye",
     5: "Fortune Seeker",
     84: "Fortune Seeker",
     164: "Fortune Seeker",
     6: "Clutch Collector",
     85: "Clutch Collector",
     165: "Clutch Collector",
     7: "Runic Discoveries",
     86: "Runic Discoveries",
     166: "Runic Discoveries",
     8: "Skilled Angler",
     87: "Skilled Angler",
     167: "Skilled Angler",
     9: "Astute Angler",
     88: "Astute Angler",
     168: "Astute Angler",
     10: "Bonus Bounty",
     89: "Bonus Bounty",
     169: "Bonus Bounty",
     11: "Gaia's Chosen",
     90: "Gaia's Chosen",
     170: "Gaia's Chosen",
     171: "Innate Angler"
  },

  // Grey Pet Bonuses
  1: {
     1: "Unrevealed",
     80: "Unrevealed",
     160: "Unrevealed",
     2: "Efficient Scavenger",
     81: "Efficient Scavenger",
     161: "Efficient Scavenger",
     3: "Bountiful Haul",
     82: "Bountiful Haul",
     162: "Bountiful Haul",
     4: "Keen Eye",
     83: "Keen Eye",
     163: "Keen Eye",
     5: "Fortune Seeker",
     84: "Fortune Seeker",
     164: "Fortune Seeker",
     6: "Clutch Collector",
     85: "Clutch Collector",
     165: "Clutch Collector",
     7: "Runic Discoveries",
     86: "Runic Discoveries",
     166: "Runic Discoveries",
     8: "Skilled Scavenger",
     87: "Skilled Scavenger",
     167: "Skilled Scavenger",
     9: "Astute Scavenger",
     88: "Astute Scavenger",
     168: "Astute Scavenger",
     10: "Bonus Bounty",
     89: "Bonus Bounty",
     169: "Bonus Bounty",
     11: "Gaia's Chosen",
     90: "Gaia's Chosen",
     170: "Gaia's Chosen",
     171: "Innate Scavenger"
  },

  // Green Pet Bonuses
  2: {
     1: "Unrevealed",
     80: "Unrevealed",
     160: "Unrevealed",
     2: "Efficient Greenskeeper",
     81: "Efficient Greenskeeper",
     161: "Efficient Greenskeeper",
     3: "Bountiful Harvest",
     82: "Bountiful Harvest",
     162: "Bountiful Harvest",
     4: "Second Chance",
     83: "Second Chance",
     163: "Second Chance",
     5: "Clutch Collector",
     84: "Clutch Collector",
     164: "Clutch Collector",
     6: "Runic Discoveries",
     85: "Runic Discoveries",
     165: "Runic Discoveries",
     7: "Skilled Greenskeeper",
     86: "Skilled Greenskeeper",
     166: "Skilled Greenskeeper",
     8: "Astute Greenskeeper",
     87: "Astute Greenskeeper",
     167: "Astute Greenskeeper",
     9: "Bonus Bounty",
     88: "Bonus Bounty",
     168: "Bonus Bounty",
     10: "Gaia's Chosen",
     89: "Gaia's Chosen",
     169: "Gaia's Chosen",
     90: "Power Surge",
     170: "Power Surge",
     171: "Innate Greenskeeper"
  }
}

const validConfidence = ["Low", "High"];

async function getPetFloors(){
  const response = await axios.get("https://dfk-floor-api.ew.r.appspot.com/petFloors")
    .catch(err => console.error(err));

  if(response){
    return response.data;
  }
  else{
    return false;
  }
}


export async function queryPets(address){

  const petFloors = await getPetFloors();

  const petCount = {
    sd:0,
    cv:0,
    sd2:0
  };

  const petTotalValue = {
    sd:0,
    cv:0,
    sd2:0
  };

  const client = new GraphQLClient(graphqlapiUrl);
  let results = await client.request(petQuery, {ownerAddress: address});
  const pets = []
  for(let petData of results.pets){
    let pet = {...petData};
    pet.rarityString = Rarity[petData.rarity];
    pet.eggString = eggType[petData.eggType];
    switch(petData.eggType){
      case 0:
        pet.displayName = blueEggData.filter(pet => pet.appearanceId === petData.appearance )[0].displayName;
        break;
      case 1:
        pet.displayName = greyEggData.filter(pet => pet.appearanceId === petData.appearance )[0].displayName;
        break;
      default:
        pet.displayName = 'Unknown';
    }
    pet.elementName = petElements[petData.element];
    pet.chainName = chainMap[petData.originRealm];
    pet.profName = professions[petData.eggType]
    let profBonusRef = petData.profBonus - (petData.eggType * 10000);
    pet.profBonus = gatheringBonuses[petData.eggType][profBonusRef];
    pet.profStars = bonusStars[Math.floor(profBonusRef / 80)];

    pet.craftBonus = bonuses[petData.craftBonus - (petData.element * 10000)];
    if(pet.craftBonus !== '-') pet.craftName = craftingTypes[petData.element]; //only show crafting type if a bonus is present
    pet.combatBonus = bonuses[petData.combatBonus]
    //set floors if available
    if(petFloors){
      let petkey = "pet:" + petData.eggType + ":" + petData.rarity; 
      let floor = petFloors[petkey];
      pet.floorPrice = floor.floorPrice;
			if(validConfidence.includes(floor.confidence)){
				pet.floorConfidence = floor.confidence;
			}
			else{
				pet.floorConfidence = "Unknown";
			}
      
      petTotalValue[pet.chainName] += pet.floorPrice;
    }
    petCount[pet.chainName]++;

    pets.push(pet);
  }
  return {pets: pets,
          count: petCount,
          totals: petTotalValue
        };
}
