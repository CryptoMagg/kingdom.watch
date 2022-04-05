<template>
  <div class="container">
    <h3>Epochs</h3>
    <div class="row">
      <div class="col-md-4 col-sm-6 col-xs-12 p-2 m-auto">
        <table class="m-auto table table-hover w-100">
          <tbody>
          <tr>
            <th class="text-start text-nowrap">Current Epoch</th>
            <th class="text-end">Serendale</th>
            <th class="text-end">Crystalvale</th>
          </tr>
          <EpochDetails whichEpoch="current" expansion="sd"/>
          <br />
          <tr>
            <th class="text-start text-nowrap">Next Epoch</th>
            <th class="text-end">Serendale</th>
            <th class="text-end">Crystalvale</th>
          </tr>
          <EpochDetails whichEpoch="next" expansion="sd"/>
          <br />
          <tr>
            <th class="text-start text-nowrap">Future Epochs</th>
            <th class="text-end">Serendale</th>
            <th class="text-end">Crystalvale</th>
          </tr>

          <template v-for="epoch in futureEpochsToShow['cv'].length" :key="epoch">
            <EpochDetails :which-epoch="epoch" expansion="sd"/>
            <tr><td colspan="3">&nbsp;</td></tr>
          </template>
          </tbody>
        </table>

        <p class="m-2">Block number: {{ currentBlockNumber['sd'] }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import epochFuncs from "../../data/Epochs"
import EpochDetails from "@/components/epoch/EpochDetails";

import {RPCs} from "@/utils/ethers";

export default {
  name: "Epoch",
  components: {EpochDetails},
  data() {
    return {
      currentEpoch: { sd: {}, cv: {} },
      nextEpoch: { sd: {}, cv: {} },
      currentBlockNumber: { sd: 0, cv: 0 },
      futureEpochs: { sd: [], cv: [] },
      futureEpochsToShow: { sd: [], cv: [] }

    }
  },
  methods: {
    async loadEpochs() {
      for (const expansion of ['sd', 'cv']) {
        this.currentBlockNumber[expansion] = await RPCs[expansion].getBlockNumber()
        this.currentEpoch[expansion] = epochFuncs.getCurrentEpoch(this.currentBlockNumber[expansion], expansion)
        this.nextEpoch[expansion] = epochFuncs.epochData(this.currentEpoch[expansion].epoch + 1, expansion)

        this.nextEpoch[expansion]["timeLeftString"] = epochFuncs.timeLeftUntilEpochString(this.currentBlockNumber[expansion], this.nextEpoch[expansion].epoch, expansion)
        for(let i = this.nextEpoch[expansion].epoch + 1; i < 60;i++) {
          this.futureEpochs[expansion][i] = epochFuncs.epochData(i, expansion)
          this.futureEpochs[expansion][i]["timeLeftString"] = epochFuncs.timeLeftUntilEpochString(this.currentBlockNumber[expansion],i,expansion)
          this.futureEpochsToShow[expansion].push(i)
        }
      }
    },
  },
  provide() {
    return {
      getEpoch: (epoch, expansion) => {
        if (epoch === "current")
          return this.currentEpoch[expansion]
        else if (epoch === "next")
          return this.nextEpoch[expansion]
        else if(this.futureEpochs[expansion][this.nextEpoch[expansion].epoch+epoch])
          return this.futureEpochs[expansion][this.nextEpoch[expansion].epoch+epoch]
        else
          return "error"
      }
    }
  },
  mounted() {
    this.loadEpochs()

  }
}
</script>

<style scoped>

</style>