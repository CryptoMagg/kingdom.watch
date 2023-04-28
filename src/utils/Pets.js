import { GraphQLClient, gql } from 'graphql-request';


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
									0: "Blue Pet Egg",
									1: "Grey Pet Egg",
									2: "Green Pet Egg",
									3: "Yellow Pet Egg",
									4: "Golden Pet Egg"
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
								"CRY": "cv",
								"SER2": "sd2"
							}
const bonuses = {
	0: "-",
	1: "1 star",
	80: "2 stars",
	160: "3 stars"
}

const professions =  {
	0: "Fishing",
	1: "Foraging",
	2: "Gardening",
};


export async function queryPets(address){
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

		pets.push(pet);
	}
	return pets;
}
