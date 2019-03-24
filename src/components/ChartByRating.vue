<template>
  <div class="chart">
    <h3>Movies passing the tests by IMDB user ratings</h3>
    <div id="ratingschart"></div>
    <div class="chartDesc">
      Due to API restrictions, user ratings are retrieved
      when a movie is added to the database, and are not updated.<br>
      IMDB user ratings have been rounded. Categories with less than 100 movies have been excluded.
    </div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Constants from '../helper/constants';

export default {
  name: 'ChartByRating',
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
      const rating = Math.round(movie.imdbData.vote_average);
      counter[rating] = counter[rating] || { total: 0, value: 0 };
      counter[rating].total = counter[rating].total + 1 || 1;
      if (parseInt(movie.rating, 10) === 3) {
        counter[rating].value = counter[rating].value + 1 || 1;
      }
    });

    this.processedData = Object.keys(counter).sort((a, b) => a - b)
      .filter(index => counter[index].total > 100)
      .map(index => ({
        genre: `${index} ⭐`,
        passed: Math.round(counter[index].value * 100 / counter[index].total * 100) / 100,
        failed: (Math.round(
          (counter[index].total - counter[index].value) * 100 / counter[index].total * 100,
        ) / 100),
      }));

    // Create chart instance
    const chart = am4core.create('ratingschart', am4charts.XYChart);
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
#ratingschart {
  height: 350px;
}
h3 {
  text-align: center;
}
</style>
