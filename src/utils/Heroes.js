import {hexToNumber} from "@harmony-js/utils";
import {valuateAllProfessions} from "@/utils/HeroValuation";

export const stats = new Map()
stats.set("AGI", "agility")
stats.set("DEX", "dexterity")
stats.set("END", "endurance")
stats.set("HP", "hp")
stats.set("INT", "intelligence")
stats.set("LCK", "luck")
stats.set("MP", "mp")
stats.set("STAMINA", "stamina")
stats.set("STR", "strength")
stats.set("VIT", "vitality")
stats.set("WIS", "wisdom")


export const statGrowth = new Map()
statGrowth.set("Warrior", {
    strength: 75,
    intelligence: 20,
    wisdom: 20,
    luck: 35,
    agility: 50,
    vitality: 65,
    endurance: 65,
    dexterity: 70
})
statGrowth.set("Knight", {
    strength: 70,
    intelligence: 20,
    wisdom: 25,
    luck: 35,
    agility: 45,
    vitality: 75,
    endurance: 75,
    dexterity: 55
})
statGrowth.set("Thief", {
    strength: 55,
    intelligence: 25,
    wisdom: 35,
    luck: 65,
    agility: 70,
    vitality: 50,
    endurance: 40,
    dexterity: 55
})
statGrowth.set("Archer", {
    strength: 55,
    intelligence: 40,
    wisdom: 25,
    luck: 40,
    agility: 50,
    vitality: 50,
    endurance: 60,
    dexterity: 80
})
statGrowth.set("Priest", {
    strength: 30,
    intelligence: 70,
    wisdom: 80,
    luck: 40,
    agility: 40,
    vitality: 50,
    endurance: 60,
    dexterity: 30
})
statGrowth.set("Wizard", {
    strength: 30,
    intelligence: 80,
    wisdom: 80,
    luck: 40,
    agility: 40,
    vitality: 50,
    endurance: 50,
    dexterity: 30
})
statGrowth.set("Monk", {
    strength: 60,
    intelligence: 25,
    wisdom: 50,
    luck: 30,
    agility: 60,
    vitality: 60,
    endurance: 55,
    dexterity: 60
})
statGrowth.set("Pirate", {
    strength: 70,
    intelligence: 20,
    wisdom: 20,
    luck: 55,
    agility: 50,
    vitality: 60,
    endurance: 55,
    dexterity: 70
})
statGrowth.set("Paladin", {
    strength: 80,
    intelligence: 30,
    wisdom: 65,
    luck: 40,
    agility: 35,
    vitality: 80,
    endurance: 80,
    dexterity: 40
})
statGrowth.set("DarkKnight", {
    strength: 85,
    intelligence: 70,
    wisdom: 35,
    luck: 35,
    agility: 35,
    vitality: 75,
    endurance: 60,
    dexterity: 55
})
statGrowth.set("Summoner", {
    strength: 45,
    intelligence: 85,
    wisdom: 85,
    luck: 40,
    agility: 50,
    vitality: 50,
    endurance: 50,
    dexterity: 45
})
statGrowth.set("Ninja", {
    strength: 50,
    intelligence: 50,
    wisdom: 40,
    luck: 60,
    agility: 85,
    vitality: 50,
    endurance: 40,
    dexterity: 75
})
statGrowth.set("Dragoon", {
    strength: 80,
    intelligence: 50,
    wisdom: 60,
    luck: 50,
    agility: 65,
    vitality: 60,
    endurance: 70,
    dexterity: 65
})
statGrowth.set("Sage", {
    strength: 40,
    intelligence: 90,
    wisdom: 90,
    luck: 55,
    agility: 75,
    vitality: 60,
    endurance: 50,
    dexterity: 40
})
statGrowth.set("DreadKnight", {
    strength: 85,
    intelligence: 65,
    wisdom: 65,
    luck: 60,
    agility: 60,
    vitality: 65,
    endurance: 75,
    dexterity: 75
})
statGrowth.set("Berserker", {
    strength: 80,
    intelligence: 20,
    wisdom: 20,
    luck: 40,
    agility: 55,
    vitality: 65,
    endurance: 60,
    dexterity: 60
})
statGrowth.set("Seer", {
    strength: 30,
    intelligence: 70,
    wisdom: 80,
    luck: 35,
    agility: 55,
    vitality: 50,
    endurance: 50,
    dexterity: 30
})
statGrowth.set("Legionnaire", {
    strength: 75,
    intelligence: 20,
    wisdom: 25,
    luck: 25,
    agility: 35,
    vitality: 75,
    endurance: 80,
    dexterity: 65
})
statGrowth.set("Scholar", {
    strength: 30,
    intelligence: 80,
    wisdom: 70,
    luck: 50,
    agility: 30,
    vitality: 55,
    endurance: 55,
    dexterity: 30
})
statGrowth.set("Shapeshifter", {
    strength: 65,
    intelligence: 25,
    wisdom: 45,
    luck: 45,
    agility: 80,
    vitality: 55,
    endurance: 55,
    dexterity: 70
})
statGrowth.set("Bard", {
    strength: 50,
    intelligence: 50,
    wisdom: 60,
    luck: 65,
    agility: 65,
    vitality: 50,
    endurance: 40,
    dexterity: 70
})
statGrowth.set("SpellBow", {
    strength: 40,
    intelligence: 85,
    wisdom: 60,
    luck: 60,
    agility: 60,
    vitality: 60,
    endurance: 45,
    dexterity: 90
})

export const rarity = ["Common", "Uncommon", "Rare", "Legendary", "Mythic"]
export const mainClass = {
    0: "Warrior",
    1: "Knight",
    2: "Thief",
    3: "Archer",
    4: "Priest",
    5: "Wizard",
    6: "Monk",
    7: "Pirate",
    8: "Berserker",
    9: "Seer",
    10: "Legionnaire",
    11: "Scholar",
    16: "Paladin",
    17: "DarkKnight",
    18: "Summoner",
    19: "Ninja",
    20: "Shapeshifter",
    21: "Bard",
    24: "Dragoon",
    25: "Sage",
    26: "SpellBow",
    28: "DreadKnight"
}


const statsGenesMap = {
    0: 'class',
    1: 'subClass',
    2: 'profession',
    3: 'passive1',
    4: 'passive2',
    5: 'active1',
    6: 'active2',
    7: 'statBoost1',
    8: 'statBoost2',
    9: 'statsUnknown1',
    10: 'element',
    11: 'statsUnknown2'
}
const choices = {
    gender: {1: 'male', 3: 'female'},
    background: {
        0: 'desert',
        2: 'forest',
        4: 'plains',
        6: 'island',
        8: 'swamp',
        10: 'mountains',
        12: 'city',
        14: 'arctic'
    },
    class: {
        0: 'warrior',
        1: 'knight',
        2: 'thief',
        3: 'archer',
        4: 'priest',
        5: 'wizard',
        6: 'monk',
        7: 'pirate',
        8: 'berserker',
        9: 'seer',
        10: 'legionnaire',
        11: 'scholar',
        16: 'paladin',
        17: 'darkKnight',
        18: 'summoner',
        19: 'ninja',
        20: 'shapeshifter',
        21: 'bard',
        24: 'dragoon',
        25: 'sage',
        26: 'spellbow',
        28: 'dreadKnight'
    },
    skinColor: {
        0: 'c58135',
        2: 'f1ca9e',
        4: '985e1c',
        6: '57340c',
        8: 'e6a861',
        10: '7b4a11',
        12: 'e5ac91',
        14: 'aa5c38'
    },
    hairColor: {
        0: 'ab9159',
        1: 'af3853',
        2: '578761',
        3: '068483',
        4: '48321e',
        5: '66489e',
        6: 'ca93a7',
        7: '62a7e6',
        16: 'd7bc65',
        17: '9b68ab',
        18: '8d6b3a',
        19: '566377',
        24: '880016',
        25: '353132',
        28: '8f9bb3'
    },
    eyeColor: {
        0: '203997',
        2: '896693',
        4: 'bb3f55',
        6: '0d7634',
        8: '8d7136',
        10: '613d8a',
        12: '2494a2',
        14: 'a41e12'
    },
    appendageColor: {
        0: 'c5bfa7',
        1: 'a88b47',
        2: '58381e',
        3: '566f7d',
        4: '2a386d',
        5: '3f2e40',
        6: '830e18',
        7: '6f3a3c',
        16: '6b173c',
        17: 'a0304d',
        18: '78547c',
        19: '352a51',
        24: 'c29d35',
        25: '211f1f',
        28: 'd7d7d7'
    },
    backAppendageColor: {
        0: 'c5bfa7',
        1: 'a88b47',
        2: '58381e',
        3: '566f7d',
        4: '2a386d',
        5: '3f2e40',
        6: '830e18',
        7: '6f3a3c',
        16: '6b173c',
        17: 'a0304d',
        18: '78547c',
        19: '352a51',
        24: 'c29d35',
        25: '211f1f',
        28: 'd7d7d7'
    },
    hairStyle: {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 16: 16, 17: 17, 18: 18, 19: 19, 24: 24, 25: 25, 28: 28},
    backAppendage: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        16: 16,
        17: 17,
        18: 18,
        19: 19,
        24: 24,
        25: 25,
        28: 28
    },
    headAppendage: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        16: 16,
        17: 17,
        18: 18,
        19: 19,
        24: 24,
        25: 25,
        28: 28
    },
    subClass: {
        0: 'warrior',
        1: 'knight',
        2: 'thief',
        3: 'archer',
        4: 'priest',
        5: 'wizard',
        6: 'monk',
        7: 'pirate',
        8: 'berserker',
        9: 'seer',
        10: 'legionnaire',
        11: 'scholar',
        16: 'paladin',
        17: 'darkKnight',
        18: 'summoner',
        19: 'ninja',
        20: 'shapeshifter',
        21: 'bard',
        24: 'dragoon',
        25: 'sage',
        26: 'spellbow',
        28: 'dreadKnight'
    },
    profession: {
        0: 'mining',
        2: 'gardening',
        4: 'fishing',
        6: 'foraging'
    },
    passive1: {
        0: 'Basic1',
        1: 'Basic2',
        2: 'Basic3',
        3: 'Basic4',
        4: 'Basic5',
        5: 'Basic6',
        6: 'Basic7',
        7: 'Basic8',
        16: 'Advanced1',
        17: 'Advanced2',
        18: 'Advanced3',
        19: 'Advanced4',
        24: 'Elite1',
        25: 'Elite2',
        28: 'Transcendent1'
    },
    passive2: {
        0: 'Basic1',
        1: 'Basic2',
        2: 'Basic3',
        3: 'Basic4',
        4: 'Basic5',
        5: 'Basic6',
        6: 'Basic7',
        7: 'Basic8',
        16: 'Advanced1',
        17: 'Advanced2',
        18: 'Advanced3',
        19: 'Advanced4',
        24: 'Elite1',
        25: 'Elite2',
        28: 'Transcendent1'
    },
    active1: {
        0: 'Basic1',
        1: 'Basic2',
        2: 'Basic3',
        3: 'Basic4',
        4: 'Basic5',
        5: 'Basic6',
        6: 'Basic7',
        7: 'Basic8',
        16: 'Advanced1',
        17: 'Advanced2',
        18: 'Advanced3',
        19: 'Advanced4',
        24: 'Elite1',
        25: 'Elite2',
        28: 'Transcendent1'
    },
    active2: {
        0: 'Basic1',
        1: 'Basic2',
        2: 'Basic3',
        3: 'Basic4',
        4: 'Basic5',
        5: 'Basic6',
        6: 'Basic7',
        7: 'Basic8',
        16: 'Advanced1',
        17: 'Advanced2',
        18: 'Advanced3',
        19: 'Advanced4',
        24: 'Elite1',
        25: 'Elite2',
        28: 'Transcendent1'
    },
    statBoost1: {
        0: 'STR',
        2: 'AGI',
        4: 'INT',
        6: 'WIS',
        8: 'LCK',
        10: 'VIT',
        12: 'END',
        14: 'DEX'
    },
    statBoost2: {0: 'STR', 2: 'AGI', 4: 'INT', 6: 'WIS', 8: 'LCK', 10: 'VIT', 12: 'END', 14: 'DEX'},
    element: {0: 'fire', 2: 'water', 4: 'earth', 6: 'wind', 8: 'lightning', 10: 'ice', 12: 'light', 14: 'dark'},
    visualUnknown1: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        16: 16,
        17: 17,
        18: 18,
        19: 19,
        24: 24,
        25: 25,
        28: 28
    },
    visualUnknown2: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        16: 16,
        17: 17,
        18: 18,
        19: 19,
        24: 24,
        25: 25,
        28: 28
    },
    statsUnknown1: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        16: 16,
        17: 17,
        18: 18,
        19: 19,
        24: 24,
        25: 25,
        28: 28
    },
    statsUnknown2: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        16: 16,
        17: 17,
        18: 18,
        19: 19,
        24: 24,
        25: 25,
        28: 28
    }
}

function kai2dec(kai) {
    const ALPHABET = '123456789abcdefghijkmnopqrstuvwx'
    return ALPHABET.indexOf(kai)
}

function genesToKai(genes) {
    const ALPHABET = '123456789abcdefghijkmnopqrstuvwx'
    // eslint-disable-next-line no-undef
    const BASE = BigInt(ALPHABET.length)

    let buf = ''
    while (genes >= BASE) {
        const mod = genes % BASE
        buf = ALPHABET[Number(mod)] + buf
        genes = (genes - mod) / BASE
    }

    // Add the last 4 (finally).
    buf = ALPHABET[Number(genes)] + buf

    // Pad with leading 0s.
    buf = buf.padStart(48, '1')

    return buf.replace(/(.{4})/g, '$1 ')
}

export function convertGenes(_genes, genesMap) {
    // First, convert the genes to kai.
    // eslint-disable-next-line no-undef
    const rawKai = genesToKai(BigInt(_genes.toString()))
        .split(' ')
        .join('')

    const genes = [{},{},{},{}]

    let geneType = 3
    // Remove spaces, and get every 4th character.
    for (const k in rawKai.split('')) {
        // eslint-disable-next-line no-prototype-builtins
        if (rawKai.hasOwnProperty(k)) {
            const trait = genesMap[Math.floor(Number(k) / 4)]

            const kai = rawKai[k]
            const valueNum = kai2dec(kai)

            genes[geneType--][trait] = choices[trait][valueNum]
            if(geneType<0)
                geneType = 3
        }
    }

    return [genes[0], genes]
}

export function getStatGenes(genes) {
    return convertGenes(genes, statsGenesMap)
}

export function extractHeroData(hero, maxScores) {
    const heroData = {}
    const [statGenes, recessiveGenes] = getStatGenes(hero.info.statGenes)

    heroData["id"] = hero.id.toString()
    heroData["generation"] = hero.info.generation * 1
    heroData["level"] = hero.state.level * 1
    heroData["xp"] = hero.state.xp * 1
    heroData["rarity"] = rarity[hero.info.rarity]
    heroData["rarityNum"] = hero.info.rarity

    console.log(`hero.info.class 10: ${hero.info.class} 16: ${parseInt(hero.info.class, 16)} => ${mainClass[hero.info.class]}`)
    heroData["mainClass"] = mainClass[hero.info.class]

    console.log(`hero.info.subClass 10: ${hero.info.subClass} 16: ${parseInt(hero.info.subClass, 16)} => ${mainClass[hero.info.subClass]}`)
    heroData["subClass"] = mainClass[hero.info.subClass]

    heroData["name"] = `${hero.info.firstName} ${hero.info.lastName}`

    heroData["profession"] = statGenes.profession

    heroData["greenGene"] = statGenes.statBoost1
    heroData["blueGene"] = statGenes.statBoost2

    heroData["recessiveGenes"] = recessiveGenes

    heroData["stats"] = {}
    heroData["pStatGrowth"] = {}
    heroData["sStatGrowth"] = {}

    for (const [stat, hexValue] of Object.entries(hero.primaryStatGrowth)) {
        heroData["pStatGrowth"][stat] = hexToNumber("0x" + hexValue)
    }

    for (const [stat, hexValue] of Object.entries(hero.secondaryStatGrowth)) {
        heroData["sStatGrowth"][stat] = hexToNumber("0x" + hexValue)
    }


    for (let stat of stats.values()) {
        heroData["stats"][stat] = hexToNumber("0x" + hero.stats[stat])
    }

    let profScore = {
        "mining":0,
        "fishing":0,
        "gardening":0,
        "foraging":0,
        "error": 0,
        "bestProfession": "error"
    }
    try {
        profScore = valuateAllProfessions(heroData)
    } catch (e) {
        console.log(`Valuation gave excpetion ${e}`)
    }
    heroData["bestRelativeScore"] = 0
    heroData["bestRelativeProfession"] = ""

    if(maxScores) {
        const relativeScores = {}

        for(let prof of ["mining", "fishing", "gardening", "foraging"]) {
            relativeScores[prof] = profScore[prof] / maxScores[prof] * 100

            if(relativeScores[prof]  > heroData["bestRelativeScore"]) {
                heroData["bestRelativeScore"] = relativeScores[prof]
                heroData["bestRelativeProfession"]  = prof
            }
        }

        heroData["relativeScores"] = relativeScores
    }

    heroData["professionScores"] = profScore
    heroData["bestProfession"] = profScore.bestProfession
    heroData["bestProfessionScore"] = profScore[profScore.bestProfession].toFixed(0)

    const nextSummon = new Date( hero.summoningInfo.nextSummonTime * 1000)

    heroData["nextSummonTime"] = nextSummon.toISOString()
    heroData["minBeforeSummon"] = ((nextSummon.valueOf() - Date.now()) / 60000).toFixed(0)
    heroData["maxSummons"] = hexToNumber("0x" + hero.summoningInfo.maxSummons)
    heroData["summonsDone"] = hexToNumber("0x" + hero.summoningInfo.summons)

    if (hero.info.generation * 1 === 0)
        heroData["summonsLeft"] = Infinity
    else
        heroData["summonsLeft"] = heroData["maxSummons"] - heroData["summonsDone"]

    heroData["staminaFullIn"] = ((hero.state.staminaFullAt * 1000 - Date.now()) / 60000).toFixed(0)

    return heroData
}
