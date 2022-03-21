<template>
  <span @click="toggleSort">&#8645;</span>
</template>

<script>
export default {
  name: "SortIcon",
  inject: ["sortToggle"],
  props: ["field"],
  methods: {
    toggleSort() {
      this.sortToggle(this.field)
    }
  }
}
</script>

<style scoped>

</style>