<template>
  <div class="col-lg-8 m-auto border border-dark rounded-3">
    <h3 class="p-3">Bank</h3>
    <span v-if="error.length > 0" class="bg-dark font-danger">{{ error }}</span>
    <div>
      <table class="m-auto table table-hover w-100" v-for="[[exp, symbol], expansion] of [[['Serendale', 'Jewel'], 'sd'], [['Crystalvale', 'Crystal'], 'cv']]" :key="symbol">
        <thead>
        <tr>
          <th class="text-start">{{ exp }}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td class="text-start">x{{ symbol }}</td>
          <td class="text-end">{{ formattedUserXBalance(expansion) }}</td>
        </tr>
        <tr>
          <td class="text-start">{{ symbol }}</td>
          <td class="text-end">{{ formattedUserBalance(expansion) }}</td>
        </tr>
        <tr>
          <td class="text-start">Bank ratio</td>
          <td class="text-end">{{ xRatio(expansion).toFixed(4) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-for="[symbol, expansion] of [['Serendale', 'sd'], ['Crystalvale', 'cv']]" :key="symbol">
      <div v-if="progress[expansion] < maxProgress[expansion]"  class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated"
             role="progressbar"
             aria-valuenow="{{ progress[expansion] }}"
             aria-valuemin="0"
             aria-valuemax="{{ maxProgress[expansion] }}"
             :style="{width: (progress[expansion]/maxProgress[expansion] * 100) + '%'}">
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import formatNumber from '@/utils/FormatNumber'
import { expansionSet, contracts, formatEther } from "@/utils/ethers"

export default {
  name: "PersonalBank",
  props: ["userAddress"],
  data() {
    return {
      xTotalSupply: {...expansionSet},
      bankBalance: {...expansionSet},
      userXBalance: {...expansionSet},
      userBankBalance: {...expansionSet},
      error: "",
      loading: true,
      progress: {...expansionSet},
      maxProgress: {
        sd: 3,
        cv: 3
      },
    }
  },
  methods: {
    loadBank() {
      Promise.all([
        contracts.sd.xToken.totalSupply()
            .then(uint256 => { this.xTotalSupply.sd = Number(formatEther(uint256)); this.progress.sd++ })
            .catch(err => { console.log(err); this.error = err }),

        contracts.sd.token.balanceOf(contracts.sd.xToken.address)
            .then(uint256 => { this.bankBalance.sd = Number(formatEther(uint256)); this.progress.sd++ })
            .catch(err => { console.log(err); this.error = err }),

        contracts.sd.xToken.balanceOf(this.userAddress)
            .then(uint256 => { this.userXBalance.sd = Number(formatEther(uint256)); this.progress.sd++ })
            .catch(err => { console.log(err); this.error = err }),
        contracts.cv.xToken.totalSupply()
            .then(uint256 => { this.xTotalSupply.cv = Number(formatEther(uint256)); this.progress.cv++ })
            .catch(err => { console.log(err); this.error = err }),

        contracts.cv.token.balanceOf(contracts.cv.xToken.address)
            .then(uint256 => { this.bankBalance.cv = Number(formatEther(uint256)); this.progress.cv++ })
            .catch(err => { console.log(err); this.error = err }),

        contracts.cv.xToken.balanceOf(this.userAddress)
            .then(uint256 => { this.userXBalance.cv = Number(formatEther(uint256)); this.progress.cv++ })
            .catch(err => { console.log(err); this.error = err }),
      ]).then(() => {
        this.loading = false
        this.userBankBalance.sd = this.xRatio("sd") * this.userXBalance.sd
        this.setBankBalance(this.userBankBalance.sd, "sd")
        this.userBankBalance.cv = this.xRatio("cv") * this.userXBalance.cv
        this.setBankBalance(this.userBankBalance.cv, "cv")
      })
    },
    loadProfile() {
      contracts.sd.profile.getProfileByAddress(this.userAddress)
          .then(profile => {
            this.setProfileName(profile._name)
          })
    },
    xRatio(expansion) {
      if (this.xTotalSupply[expansion] > 0 && this.bankBalance[expansion] > 0)
        return this.bankBalance[expansion] / this.xTotalSupply[expansion]
      else
        return 0.0
    },
    formattedUserXBalance(expansion) {
      return formatNumber(this.userXBalance[expansion])
    },
    formattedUserBalance(expansion) {
      return formatNumber(this.userBankBalance[expansion])
    }
  },
  inject: ["setBankBalance", "setProfileName"],
  mounted() {
    this.loadBank()
    this.loadProfile()
  }
}
</script>

<style scoped>

</style>