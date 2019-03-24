<template>
  <div class="chart">
    <h3>Evolution of movies passing the test since {{ startYear }}</h3>
    <div id="yearschart"></div>
    <div class="chartDesc">
      Movies start in {{ startYear }} and end in {{ endYear }}
      due to the lack of data in the first half of the 20th century and after {{ endYear }}.
      </div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Utils from '../helper/utils';
import Constants from '../helper/constants';

export default {
  name: 'ChartYears',
  props: {
  },
  data: () => ({
    startYear: 1945,
    endYear: 2018,
    processedData: [],
    loaded: false,
    maxY: null,
  }),
  computed: {
    data() {
      return this.$store.state.data;
    },
  },
  mounted() {
    const counter = {};
    this.data.forEach((movie) => {
      const year = parseInt(movie.year, 10);
      if (!year || year < this.startYear || year > this.endYear) {
        return;
      }
      counter[movie.year] = counter[movie.year] || { total: 0 };
      counter[movie.year].total = counter[movie.year].total + 1 || 1;
      const rating = parseInt(movie.rating, 10);
      counter[movie.year][rating] = counter[movie.year][rating] + 1 || 1;
    });
    this.processedData = Object.keys(counter)
      .map(index => ({
        category: index,
        value1: Math.round(counter[index][0] * 100 / counter[index].total * 100) / 100 || 0,
        value2: Math.round(counter[index][1] * 100 / counter[index].total * 100) / 100 || 0,
        value3: Math.round(counter[index][2] * 100 / counter[index].total * 100) / 100 || 0,
        value4: Math.round(counter[index][3] * 100 / counter[index].total * 100) / 100 || 0,
      }));

    const chart = am4core.create('yearschart', am4charts.XYChart);

    chart.data = this.processedData;

    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);
    chart.legend = new am4charts.Legend();

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;

    for (let i = 1; i <= 4; i += 1) {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.columns.template.width = am4core.percent(70);
      series.columns.template.tooltipText = "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
      series.columns.template.fill = am4core.color(Constants.PALETTE_COLORS[i - 1]);
      series.columns.template.stroke = am4core.color('#fff'); // am4core.color(Constants.PALETTE_COLORS[i - 1]);
      series.columns.template.strokeWidth = 0.6;

      series.name = Utils.getRatingLabel(i - 1);
      series.dataFields.categoryX = 'category';
      series.dataFields.valueY = `value${i}`;
      series.dataFields.valueYShow = 'totalPercent';
      series.dataItems.template.locations.categoryX = 0.5;
      series.stacked = true;
      series.tooltip.pointerOrientation = 'vertical';

      const bullet1 = series.bullets.push(new am4charts.LabelBullet());
      bullet1.interactionsEnabled = false;
      bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
      bullet1.label.fill = am4core.color('#ffffff');
      bullet1.locationY = 0.5;
    }

    chart.scrollbarX = new am4core.Scrollbar();
  },
};
</script>

<style scoped>
#yearschart {
  height: 500px;
}
h3 {
  text-align: center;
}
</style>
