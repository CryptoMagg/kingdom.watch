import { GraphQLClient, gql } from 'graphql-request';
import axios from "axios";


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
const bonuses = {
  0:   "-",
  1:   "★",
  80:  "★★",
  160: "★★★"
}

const professions =  {
  0: "Fishing",
  1: "Foraging",
  2: "Gardening",
};

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
    pet.profBonus = bonuses[petData.profBonus]
    pet.craftBonus = bonuses[petData.craftBonus]
    pet.combatBonus = bonuses[petData.combatBonus]
    //set floors if available
    if(petFloors){
      let floor = petFloors[petData.rarity];
      pet.floorPrice = floor.floorPrice;
      pet.floorConfidence = floor.confidence;
      
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
