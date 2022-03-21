<template>
  <Header/>
  <router-view/>
  <Footer/>
</template>

<script>
import Header from "@/components/generic/Header";
import Footer from "@/components/generic/Footer";

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
