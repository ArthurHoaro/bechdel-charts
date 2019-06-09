<template>
  <div class="chart">
    <h3>Movies passing the test by genre</h3>
    <div id="genrechart"></div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Constants from '../helper/constants';

export default {
  name: 'ChartByGenre',
  components: {
  },
  props: {
  },
  data: () => ({
    processedData: {},
  }),
  computed: {
    data() {
      return this.$store.state.data;
    },
  },
  mounted() {
    const counter = {};
    this.data.forEach((movie) => {
      movie.imdbData.genres.forEach((genre) => {
        counter[genre.name] = counter[genre.name] || { total: 0, value: 0 };
        counter[genre.name].total = counter[genre.name].total + 1 || 1;
        if (parseInt(movie.rating) === 3) {
          counter[genre.name].value = counter[genre.name].value + 1 || 1;
        }
      });
    });
    this.processedData = Object.keys(counter)
    .map(index => ({
      genre: index,
      passed: Math.round(counter[index].value * 100 / counter[index].total * 100) / 100,
      failed: (Math.round(
        (counter[index].total - counter[index].value) * 100 / counter[index].total * 100,
      ) / 100),
    }))
    .sort((a, b) => a.failed - b.failed);

    // Create chart instance
    const chart = am4core.create('genrechart', am4charts.XYChart);
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top';

    chart.data = this.processedData;

    // Create axes
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'genre';
    categoryAxis.renderer.grid.template.opacity = 0;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.grid.template.opacity = 0;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
    valueAxis.renderer.ticks.template.stroke = am4core.color('#495C43');
    valueAxis.renderer.ticks.template.length = 10;
    valueAxis.renderer.line.strokeOpacity = 0.5;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.minGridDistance = 40;

    // Create series
    function createSeries(field, name, color) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = 'genre';
      series.columns.template.fill = am4core.color(color);
      series.columns.template.stroke = new am4core.color('#FFFFFF');
      series.stacked = true;
      series.name = name;

      const labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.locationX = 0.5;
      labelBullet.label.text = '{valueX} %';
      labelBullet.label.fill = am4core.color('#fff');
    }

    createSeries('passed', 'passed', Constants.PALETTE_COLORS[3]);
    createSeries('failed', 'failed', Constants.PALETTE_COLORS[0]);
  },
};
</script>

<style scoped>
#genrechart {
  height: 900px;
}
h3 {
  text-align: center;
}
</style>
