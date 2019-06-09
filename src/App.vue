<template>
  <div id="app">
    <Home msg="Bechdel Movie Test Statistics"/>
  </div>
</template>

<script>
import Home from './components/Home.vue';

export default {
  name: 'app',
  components: {
    Home,
  },
};
</script>

<style lang="scss">
body {
  background-color: #30303d !important;
}

#app {
  font-family: 'Lato', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  margin-top: 60px;
}
</style>
