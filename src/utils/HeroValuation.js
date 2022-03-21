import {stats, statGrowth} from "@/utils/Heroes";

// All professions
export function valuateAllProfessions(heroData) {

    const scores = {}

    for (let prof of professions)
        scores[prof] = valuateProfession(heroData, prof)

    let bestProfession = ""
    let bestScore = 0

    for (let prof of professions) {
        if (scores[prof] > bestScore) {
            bestProfession = prof
            bestScore = scores[prof]
        }
    }

    scores["bestProfession"] = bestProfession

    return scores
}

// valuate one profession
export function valuateProfession(heroData, profession) {

    const [stat1name, stat2name] = professionStats[profession]

    // How many levels left before 100
    const levelsLeft = 100 - heroData.level

    // current stat + expected growth
    const stat1val = heroData.stats[stat1name] * 1 + calcStatGrowth(heroData, stat1name, levelsLeft)
    const stat2val = heroData.stats[stat2name] * 1 + calcStatGrowth(heroData, stat2name, levelsLeft)

    // Combine them
    let statSum = stat1val + stat2val

    // If this is the main profession of the hero, add 10%
    if(heroData.profession === profession)
        statSum *= 1.1

    return statSum
}

// Per Stat
function calcStatGrowth(heroData, stat, levels) {
    let growth = 0.0

    // Stat Growth
    growth += statGrowth.get(heroData.mainClass)[stat] / 100
    growth += statGrowth.get(heroData.subClass)[stat] / 100 * 0.25

    // Blue gene will give + 2% to the primary stat growth and + 4% to the secondary
    // Since this function works per stat we just add the two bonuses to the growth
    if (stats.get(heroData.blueGene) === stat) {
        growth += 0.02 // primary
        growth += 0.04 // secondary
    }

    // Rarity bonus
    growth += rarityMultiplierPct[heroData.rarity] / 100

    // Half of +1 stat choice every level
    growth += 0.5

    // Half of Gaia's blessing 50% chance of +1 for the other gene
    growth += 0.25

    //console.info(`${stat} p_stat_growth: ${statGrowth.get(heroData.mainClass)[stat] / 100} s_stat_growth: ${statGrowth.get(heroData.subClass)[stat] / 100 * 0.25} total: ${growth}`)

    return  growth * levels
}

export const professions = ["mining", "gardening", "fishing", "foraging"]

const professionStats = {
    mining: ["strength", "endurance"],
    gardening: ["wisdom", "vitality"],
    fishing: ["agility", "luck"],
    foraging: ["dexterity", "intelligence"],
}

const rarityMultiplierPct = {
    Common: 0,
    Uncommon: 25 / 5,
    Rare: 50 / 5,
    Legendary: 87.5 / 5,
    Mythic: 125 / 5
}