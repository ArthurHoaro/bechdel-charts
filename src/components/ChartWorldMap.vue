<template>
  <div class="chart">
    <h3>Movies passing the tests by country of production</h3>
    <div id="worldchart"></div>
    <div class="chartDesc">Coutries with 10 or fewer movies have been excluded.<br>
    Movies with multiple countries of production have been counted for each country.</div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
// eslint-disable-next-line
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import Constants from '../helper/constants';

// am4core.useTheme(am4themes_animated);

export default {
  name: 'ChartWorldMap',
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
      movie.imdbData.production_countries.forEach((country) => {
        counter[country.iso_3166_1] = counter[country.iso_3166_1] || { total: 0, value: 0 };
        counter[country.iso_3166_1].total = counter[country.iso_3166_1].total + 1 || 1;
        if (parseInt(movie.rating, 10) === 3) {
          counter[country.iso_3166_1].value = counter[country.iso_3166_1].value + 1 || 1;
        }
      });
    });
    this.processedData = Object.keys(counter)
      .filter(index => counter[index].total > 10)
      .map(index => ({
        id: index,
        value: Math.round(counter[index].value * 100 / counter[index].total * 100) / 100,
      }));

    const map = am4core.create('worldchart', am4maps.MapChart);
    // eslint-disable-next-line
    map.geodata = am4geodata_worldLow;

    map.projection = new am4maps.projections.Miller();
    const polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.heatRules.push({
      property: 'fill',
      target: polygonSeries.mapPolygons.template,
      min: new am4core.color(Constants.PALETTE_COLORS[0]),
      max: new am4core.color(Constants.PALETTE_COLORS[3]),
    });
    polygonSeries.useGeodata = true;
    polygonSeries.exclude = ['AQ'];
    polygonSeries.data = this.processedData;

    const heatLegend = map.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.align = 'right';
    heatLegend.width = am4core.percent(25);
    heatLegend.marginRight = am4core.percent(4);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 100;

    // Set up custom heat map legend labels using axis ranges
    const minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.value = heatLegend.minValue;
    minRange.label.text = '0 % passed';
    const maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.value = heatLegend.maxValue;
    maxRange.label.text = '100 % passed';

    // Blank out internal heat legend value axis labels
    heatLegend.valueAxis.renderer.labels.template.adapter.add('text', () => '');

    // Configure series tooltip
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}: {value} %';
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;
    polygonTemplate.stroke = new am4core.color('#000');

    // Create hover state and set alternative fill color
    const hs = polygonTemplate.states.create('hover');
    hs.properties.fill = new am4core.color('#FFFFFF');
  },
};
</script>

<style scoped>
#worldchart {
  height: 500px;
}
h3 {
  text-align: center;
}
</style>
