<template>
  <div class="container">
    <h3>Epochs</h3>
    <div class="row">
      <div class="col-md-4 col-sm-6 col-xs-12 p-2 m-auto">
        <table class="m-auto table table-hover w-100">
          <tbody>
          <tr>
            <th colspan="2">Current Epoch</th>
          </tr>
          <EpochDetails whichEpoch="current"/>
          <br />
          <tr>
            <th colspan="2">Next Epoch</th>
          </tr>
          <EpochDetails whichEpoch="next"/>
          <br />
          <tr>
            <th colspan="2">Future Epochs</th>
          </tr>

          <template v-for="epoch in futureEpochsToShow" :key="epoch">
            <EpochDetails :which-epoch="epoch"/>
            <tr><td colspan="2">&nbsp;</td></tr>
          </template>
          </tbody>
        </table>

        <p class="m-2">Block number: {{ currentBlockNumber }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import epochFuncs from "../../data/Epochs"
import EpochDetails from "@/components/epoch/EpochDetails";

const {Harmony} = require('@harmony-js/core');
const {
  ChainID,
  ChainType,
  hexToNumber
} = require('@harmony-js/utils');

const hmy = new Harmony(
    'https://harmony-0-rpc.gateway.pokt.network', //'https://api.harmony.one',
    {
      chainType: ChainType.Harmony,
      chainId: ChainID.HmyMainnet,
    },
);

export default {
  name: "Epoch",
  components: {EpochDetails},
  data() {
    return {
      currentEpoch: {},
      nextEpoch: {},
      currentBlockNumber: 0,
      futureEpochs: [],
      futureEpochsToShow: []

    }
  },
  methods: {
    async loadEpochs() {
      this.currentBlockNumber = hexToNumber((await hmy.blockchain.getBlockNumber()).result)

      this.currentEpoch = epochFuncs.getCurrentEpoch(this.currentBlockNumber)
      this.nextEpoch = epochFuncs.epochData(this.currentEpoch.epoch + 1)

      this.nextEpoch["timeLeftString"] = epochFuncs.timeLeftUntilEpochString(this.currentBlockNumber, this.nextEpoch.epoch)

      for(let i = this.nextEpoch.epoch + 1; i < 60;i++) {
        this.futureEpochs[i] = epochFuncs.epochData(i)
        this.futureEpochs[i]["timeLeftString"] = epochFuncs.timeLeftUntilEpochString(this.currentBlockNumber,i)
        this.futureEpochsToShow.push(i)
      }
    },
  },
  provide() {
    return {
      getEpoch: (epoch) => {
        if (epoch === "current")
          return this.currentEpoch
        else if (epoch === "next")
          return this.nextEpoch
        else if(this.futureEpochs[epoch])
          return this.futureEpochs[epoch]
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