<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h3>Hero Rankings</h3>

        <h4 class="font-monospace">Kingdom.Watch Profession Score</h4>
        <p class="text-start">
          The <span class="font-monospace">Kingdom.Watch Profession Score (KWPS)</span> is a modified version the great
          algorithm Discord user @GokMachar
          published
          in the <a href="https://www.reddit.com/r/DefiKingdoms/comments/qpotgf/analysis_on_profession/"
                    target="_blank">Analysis on profession</a> Reddit post.
        </p>
        <p class="text-start bg-dark text-light">
          <strong><em>In short the score is the expected value of the sum of the two relevant skills for the profession,
            assuming perfect/focused leveling. The profession gene adds a 10% bonus to this value for now, but as we get
            more information about the actual impact of the main profession this will be adjusted.</em></strong>
        </p>
        <p class="text-start">
          The most visible difference from @GokMachar's algorithm is that the KWPS is not normalized and not discounted.
          Once the scoring algorithm is stable a hero's score will not change significantly after each level.
        </p>
        <p class="text-start">
          Below is a listing of the different versions of the KWPS and what the major changes are. After a few
          iterations
          and some tuning, the goal is for the KWPS to become a stable scoring algorithm. The source code for the most
          current version will always be available from this page, and third parties are welcome to use it in their own
          apps. Just please leave a reference to this page.
        </p>
        <table class="table table-striped">
          <thead>
          <tr>
            <th class="text-start">Version</th>
            <th class="text-start">Change summary</th>
            <th class="text-start">Source</th>

          </tr>
          </thead>
          <tbody>

          <tr>
            <td class="text-start">v0.5.1</td>
            <td class="text-start">
              <p>Bug fix release. Fix the blue gene. All heroes get a few extra points in the profession the blue gene affects.</p>
              <p>Again, thanks for the bug report!</p>
            </td>
            <td>
              <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#kwps_src"
                      aria-expanded="false" aria-controls="kwps_src">
                Show
              </button>
            </td>
          </tr>
          <tr>
            <td class="text-start">v0.5</td>
            <td class="text-start">
              <p>Bug fix release. Most heroes drop about 200 points. I am sorry!</p>

              <p>This will take the scoring one step further towards being the actual expected value of the stats at
                level 100.</p>

              <p>
                An anonymous hero notified me that the algorithm had an error. In an earlier version I used the inputs
                as multipliers, and when I changed it to be addition instead, I forgot to remove one part. The line
                <span class="font-monospace bg-dark text-light">growth += (100 + rarityMultiplierPct[heroData.rarity]) / 100</span>
                should have been <span class="font-monospace bg-dark text-light">growth += rarityMultiplierPct[heroData.rarity] / 100</span>
                with that change. The result is that the rarity multiplier gave more than 1 point of stat at every level,
                instead of 0 for a Common hero and 0.25 for a Mythic hero per level.
              </p>
              <p>
                This is the beauty of you DFK fam peer reviewing my contribution to the valuation of heroes. I am sorry
                that the score keeps going down. I realize that it would have felt much better if it continued to go up
                instead, but I want to stay true to the goal of the KWPS being the expected combined value of the relevant
                stats (+10% bonus for the main profession - Getting back to that when we get more information from
                Hubert or Frisky).
              </p>
              <p>
                <strong>Finally I want to give my heartfelt thanks to the anonymous person reporting this bug. I really
                  appreciate you taking the time to study my code to such an degree! Thank you!</strong>
              </p>

            </td>
            <td>
            </td>
          </tr>
          <tr>
            <td class="text-start">v0.4</td>
            <td class="text-start">
              To make the score stay more stable over time, the 8% discount to the contribution of each
              further level from the current was removed.

              <ul>
                <li>The score is now the actual expected value of the two relevant skills combined at level 100.</li>
                <li>The score will now stay pretty stable as a hero levels up.</li>
                <li>The score assumes focusing on the given profession in all leveling actions.</li>
                <li>The profession gene adds a 10% bonus to that profession, as that is the estimated gain it will
                  have
                </li>
                <li>
                  Beware that due to RNG it is not possible to calculate exactly what the sum of the relevant skills
                  will be at level 100, so the score is an estimate.
                </li>
                <li>
                  One additional bug was discovered so the scores are lower again. Hope that is the last time!
                </li>
              </ul>
            </td>
            <td />
          </tr>
          <tr>
            <td class="text-start">v0.3</td>
            <td class="text-start">
              <ul>
                <li>
                  Due to two separate bugs in the actual implementation of the stat growth in the blockchain, the stat
                  growth calculation is now done completely without considering the growth values stored in the
                  blockchain.
                </li>
              </ul>
              <em>
                Thanks to MrZipper and AvgJoe40 for confirming one blockchain bug and making me aware of a second, as
                well as reporting an issue with KWPS v0.2.
              </em>
            </td>
            <td/>
          </tr>
          <tr>
            <td class="text-start">v0.2</td>
            <td class="text-start">
              <ul>
                <li>
                  Changed the Blue Gene modifier from <span class="font-monospace bg-dark text-light">priStatGrowth *= 1.02</span>
                  to <span class="font-monospace bg-dark text-light">priStatGrowth += 0.02</span> for the primary stat
                  growth and similar for the secondary stat growth.
                </li>
                <li>
                  Corrected the Gaia's blessing to only provide <span
                    class="font-monospace bg-dark text-light">25%</span>
                  growth as the algorithm expects the player to always chose one of the profession stats for the
                  selectable stat bonus, leaving only one relevant stat to be electable for the blessing.
                </li>
              </ul>
            </td>
            <td/>
          </tr>
          <tr>
            <td class="text-start">v0.1</td>
            <td class="text-start">Initial release</td>
            <td/>
          </tr>
          </tbody>
        </table>

        <div class="collapse" id="kwps_src">
          <div class="card card-body">
            <h5 class="card-title">
              KWPS v0.5.1
              <span class="text-info">CURRENT</span>
            </h5>
            <pre class="text-start">

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

    // Rarity bonus - bug fixed!
    growth += rarityMultiplierPct[heroData.rarity] / 100

    // Half of +1 stat choice every level
    growth += 0.5

    // Half of Gaia's blessing 50% chance of +1 for the other gene
    growth += 0.25

    return  growth * levels
}

const rarityMultiplierPct = {
    Common: 0,
    Uncommon: 25 / 5,
    Rare: 50 / 5,
    Legendary: 87.5 / 5,
    Mythic: 125 / 5
}

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
})</pre>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeroRanking"
}
</script>

<style scoped>

</style>
