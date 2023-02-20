<template>
  <div class="col-lg-8 m-auto border border-dark rounded-3">
    <h3 class="p-3">Jeweler</h3>
    <span v-if="error.length > 0" class="bg-dark font-danger">{{ error }}</span>
    <div>
      <table class="m-auto table table-hover w-100" v-for="[[exp, symbol], expansion] of [[['Crystalvale', 'cJewel'], 'cv'],[['Serendale 2.0', 'sJewel'], 'sd2']]" :key="expansion">
        <thead>
        <tr>
          <th class="text-start">{{exp}}</th>
          <th class="text-end">Total: ${{formatNumber(this.usdValue[expansion] + this.pendingRewardUSD[expansion])}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="text-start">{{ symbol }}</td>
          <td class="text-end">{{formatNumber(this.tokenBalance[expansion])}}</td>
        </tr>
        <tr>
          <td class="text-start">Staked Jewel</td>
          <td class="text-end">{{ formatNumber(this.jewelAmount[expansion]) }}</td>
        </tr>
        <tr>
          <td class="text-start">USD Value</td>
          <td class="text-end">${{ formatNumber(this.usdValue[expansion]) }}</td>
        </tr>
        <tr>
          <td class="text-start">Unlock Time</td>
          <td class="text-end">{{ this.unlockTime[expansion].toLocaleString() }}</td>
        </tr>
        <tr>
          <td class="text-start">Pending Rewards</td>
          <td class="text-end">{{ formatNumber(this.pendingReward[expansion]) }} Jewel (${{formatNumber(this.pendingRewardUSD[expansion])}})</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import formatNumber from '@/utils/FormatNumber'
import { expansionSet, contracts, formatEther } from "@/utils/ethers"

export default {
  name: "PersonalJeweler",
  props: ["userAddress"],
  data() {
    return {
      jewelAmount: {...expansionSet},
      usdValue: {...expansionSet},
      tokenBalance: {...expansionSet},
      unlockTime: {...expansionSet},
      pendingReward: {...expansionSet},
      pendingRewardUSD: {...expansionSet},
      error: "",
      loading: true,
      progress: {...expansionSet},
      maxProgress: {
        cv : 2,
        sd2: 2
      },
    }
  },
  methods: {
    async loadJeweler() {
      for(let expansion of ['cv','sd2']){
        let info = await contracts[expansion].jeweler.userInfo(this.userAddress);
        this.progress[expansion]++
        this.jewelAmount[expansion]  = Number(formatEther(info[0]));
	
        this.usdValue[expansion]  = this.jewelAmount[expansion] * this.prices('sd');
  
        this.tokenBalance[expansion] = Number(formatEther(info[1]));
        this.unlockTime[expansion]   = new Date(info[2] * 1000);

        let pendingReward = await contracts[expansion].jeweler.pendingReward(this.userAddress);
        this.progress[expansion]++

        this.pendingReward[expansion] = Number(formatEther(pendingReward));
        this.pendingRewardUSD[expansion] = this.pendingReward[expansion] * this.prices('sd');

        this.setJewelerbalance(expansion, this.jewelAmount[expansion] + this.pendingReward[expansion], this.tokenBalance[expansion] , this.usdValue[expansion] + this.pendingRewardUSD[expansion]  );
      }
    },
    formatNumber(num, prefix) {
      return formatNumber(num, prefix)
    },
  },
  inject: ["setJewelerbalance", "setProfileName", "prices"],
  mounted() {
    this.loadJeweler()
  }
}
</script>

<style scoped>

</style>