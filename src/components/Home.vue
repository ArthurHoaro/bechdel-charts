<template>
  <div class="root">
    <div class="container">
      <h1>{{ msg }}</h1>

      <div class="row desc">
        <div class="col-sm-12 offset-sm-0 col-md-10 offset-md-1 col-lg-6 offset-lg-3">
          <h2>Rules</h2>
          <p>
            1. It has to have at least two [named] women in it<br>
            2. Who talk to each other<br>
            3. About something besides a man<br>
            <a href=http://bechdeltest.com/ target="_blank">bechdeltest.com</a>
          </p>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 offset-md-0 col-lg-5 offset-lg-1">
          <ChartPieGlobal v-if="loaded" />
        </div>
        <div class="col-sm-12 offset-sm-0 col-lg-5 offset-lg-1">
          <ChartPieGlobal minYear="2010" v-if="loaded" />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 offset-sm-0 col-lg-10 offset-lg-1">
          <ChartYears v-if="loaded" />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 offset-sm-0 col-lg-10 offset-lg-1">
          <ChartByGenre v-if="loaded" />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 offset-sm-0 col-lg-8 offset-lg-2">
          <ChartWorldMap v-if="loaded" />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 offset-sm-0 col-lg-10 offset-lg-1">
          <ChartByRating v-if="loaded" />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 offset-sm-0 col-lg-10 offset-lg-1">
          <ChartByCrew v-if="loaded" />
        </div>
      </div>
      <div class="row desc">
        <div class="col-sm-12 offset-sm-0 col-md-10 offset-md-1 col-sm-12 col-lg-6 offset-lg-3">
          <h2>About</h2>
          <p>
            Made by ArthurHoaro. <a href="https://github.com/ArthurHoaro/bechdel-charts">Source code</a>.
          </p>
          <p>
            Charts are based on a {{ movieCount }} movies database and are updated everyday.
          </p>
          <p>
            These charts rely on data openly and kindly provided by
            <a href="http://bechdeltest.com/">Bechdel Test Movie List</a>,
            <a href="https://www.themoviedb.org/">The Movie DB</a> and
            <a href="http://www.omdbapi.com/">OMBb API</a>.<br>
            Special thank to <a href="https://www.amcharts.com/">amCharts</a> for providing such a great library for free.
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
// eslint-disable-next-line
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
import ChartPieGlobal from './ChartPieGlobal.vue';
import ChartYears from './ChartYears.vue';
import ChartWorldMap from './ChartWorldMap.vue';
import ChartByGenre from './ChartByGenre.vue';
import ChartByRating from './ChartByRating.vue';
import ChartByCrew from './ChartByCrew.vue';
import movieDB from '../assets/data/movies.json';

export default {
  name: 'Home',
  components: {
    ChartPieGlobal,
    ChartYears,
    ChartWorldMap,
    ChartByGenre,
    ChartByRating,
    ChartByCrew,
  },
  props: {
    msg: String,
  },
  data: () => ({
    loaded: false,
    width: '80%',
  }),
  computed: {
    movieCount() {
      return this.$store.state.data.length;
    },
  },
  mounted() {
    am4core.useTheme(am4themes_dark);
    this.$store.commit('setData', movieDB);
    this.loaded = true;
  },
};
</script>

<style lang="scss">
h1 {
  text-align: center;
  font-size: 42px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #fff !important;
  text-decoration: underline !important;
}
.desc {
  margin: 25px 0;
}
.chartDesc {
  text-align: center;
  margin: 10px 0;
}
</style>

<style lang="scss">
.chart {
  margin: 50px auto 0px auto;
}
</style>
