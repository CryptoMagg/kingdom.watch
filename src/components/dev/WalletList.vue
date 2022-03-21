<template>
  <div>
    <h3 class="text-start">Known wallet addresses</h3>
    <table class="table table-striped">
      <thead>
      <tr>
        <th class="text-start">Description</th>
        <th class="text-start">Address</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(desc, wallet) in addressMap" :key="wallet">
        <td class="text-start">{{ desc }}</td>
        <td class="text-start font-monospace">{{ wallet }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import addressMap from '../../data/Wallets'

export default {
  name: "WalletList",
  data() {
    return {
      addressMap: addressMap
    }
  }
}
</script>

<style scoped>

</style>