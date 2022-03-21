<template>
  <span class="font-monospace">{{ addressString }}</span>
</template>

<script>
import addressMap from '../../data/Wallets'

export default {
  name: "Address",
  props: [
    'address'
  ],
  computed: {
    addressString: function () {
      const addr = this.address.toLowerCase()
      const shortAddress = addr.substr(0, 6) + "..." + addr.substr(38, 41)
      if (addressMap[addr])
        return `${addressMap[addr]} (${shortAddress})`
      else
        return shortAddress
    }
  }
}
</script>

<style scoped>

</style>