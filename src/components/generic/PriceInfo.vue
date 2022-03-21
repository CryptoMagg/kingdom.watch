<template>
<pre class="text-start" v-if="priceData.timestamp > 0">
Information about the prices:

The price of JEWEL is ${{ priceData.prices["JEWEL"].toFixed(2)}}

Based on the weighted average of
JEWEL pairs with these stablecoins:

<template v-for="weight in priceData.weights['JEWEL']" :key="weight">{{ weight.symbol }} ({{ (weight.weight *100).toFixed(1)}}%)
</template>

Updated {{ ((Date.now() - priceData.timestamp) / 1000).toFixed(0) }} seconds ago
</pre>
</template>

<script>
export default {
  name: "PriceInfo",
  props: ["priceData"]
}
</script>

<style scoped>

</style>