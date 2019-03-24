<template>
  <div>
    <h3>Movies passing the tests (since {{ year }})</h3>
    <div :id="`globalpiechart${year}`"></div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

import { setTimeout } from 'timers';
import Utils from '../helper/utils';
import Constants from '../helper/constants';

export default {
  name: 'ChartPieGlobal',
  props: {
    minYear: String,
  },
  data: () => ({
    processedData: [],
    year: 9000,
  }),
  computed: {
    data() {
      return this.$store.state.data;
    },
  },
  mounted() {
    if (this.minYear) {
      this.year = this.minYear;
    }
    const series = {};
    let total = 0;
    this.data.forEach((movie) => {
      if (!this.minYear) {
        this.year = movie.year < this.year ? movie.year : this.year;
      }
      if (!this.minYear || movie.year >= this.minYear) {
        series[parseInt(movie.rating, 10)] = series[parseInt(movie.rating, 10)] + 1 || 1;
        total += 1;
      }
    });
    this.processedData = Object.keys(series).map(key => ({
      category: Utils.getRatingLabel(parseInt(key, 10)),
      value: Math.round(series[key] * 100 / total * 100) / 100,
    }));

    setTimeout(() => {
      // Create chart instance
      const chart = am4core.create(`globalpiechart${this.year}`, am4charts.PieChart);
      chart.data = this.processedData;

      // Add and configure Series
      const pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = 'value';
      pieSeries.dataFields.category = 'category';
      pieSeries.slices.template.stroke = am4core.color('#fff');
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.colors.list = Constants.PALETTE_COLORS.map(color => new am4core.color(color));

      // This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
    }, 1000);
  },

};
</script>

<style scoped>
#globalpiechart {
  height: 300px;
}
h3 {
  text-align: center;
}
</style>
