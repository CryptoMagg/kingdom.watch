<template>
  <div class="row">
    <div class="col col-md-6 col-lg-4 col-xl-3 m-auto">
      <table class="table table-striped">
        <thead>
        <tr>
          <th class="text-start">
            Item
            <SortIcon field="name" />
          </th>
          <th class="text-end">
            Amount
            <SortIcon field="amount" />
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="reward in sortedItems" :key="reward">
          <td class="text-start">
            <img :src="reward.item.logoURI" :alt="reward.item.name" style="width: 50px;">
            {{ reward.item.name }}
          </td>
          <td class="text-end">{{ formatNumber(reward.amount) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import SortIcon from "@/components/generic/SortIcon";
import formatNumber from "../../utils/FormatNumber";

const defaultSort = {
  name: 0,
  amount: 0
}
export default {
  name: "QuestsTotal",
  components: {SortIcon},
  inject: ["totals"],
  data() {
    return {
      itemSort: {...defaultSort}
    }
  },
  computed: {
    sortedItems() {
      const sortOrder = this.itemSort
      const items = [...this.totals()]


      if (sortOrder.name> 0)
        items.sort((a, b) => a.item.name.localeCompare(b.item.name))
      else if (sortOrder.name < 0)
        items.sort((a, b) => b.item.name.localeCompare(a.item.name))

      else if (sortOrder.amount > 0)
        items.sort((a, b) => a.amount - b.amount)
      else if (sortOrder.amount < 0)
        items.sort((a, b) => b.amount - a.amount)

      else
        items.sort((a, b) => a.item.name.localeCompare(b.item.name))

      return items
    }
  },
  methods: {
    formatNumber(num, prefix, suffix, decimals) {
      return formatNumber(num, prefix, suffix, decimals)
    },
    toggleSort(field) {
      let currentDir = this.itemSort[field]

      if (currentDir === 0)
        currentDir = -1

      this.itemSort = {...defaultSort}

      this.itemSort[field] = currentDir * -1
      console.info(this.itemSort)
    }
  },
  provide() {
    return {
      sortToggle: (field) => this.toggleSort(field)
    }
  }
}
</script>

<style scoped>

</style>
