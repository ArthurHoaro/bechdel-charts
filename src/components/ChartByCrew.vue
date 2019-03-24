<template>
  <div class="chart">
    <h3>Movies passing the tests by crew gender</h3>
    <div class="chartDesc">Not specified genders have been excluded.</div>
    <h4>{{ jobs[0] }}</h4>
    <div class="row">
      <div class="col-lg-6">
        <div id="gender01" class="genrechart"></div>
      </div>
      <div class="col-lg-6">
        <div id="gender02" class="genrechart"></div>
      </div>
    </div>
    <h4>{{ jobs[1] }}</h4>
    <div class="row">
      <div class="col-lg-6">
        <div id="gender11" class="genrechart"></div>
      </div>
      <div class="col-lg-6">
        <div id="gender12" class="genrechart"></div>
      </div>
    </div>
    <h4>{{ jobs[2] }} Writer</h4>
    <div class="row">
      <div class="col-lg-6">
        <div id="gender21" class="genrechart"></div>
      </div>
      <div class="col-lg-6">
        <div id="gender22" class="genrechart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import Constants from '../helper/constants';

export default {
  name: 'ChartByCrew',
  components: {
  },
  props: {
  },
  data: () => ({
    processedData: {},
    jobs: ['Director', 'Executive Producer', 'Screenplay'],
    genders: ['Not specified', 'Woman', 'Man'],
    icons: [
      '',
      'M372,290L314,494C302,538,355,556,368,514L419,326H434L345,656H428V904C428,949,490,949,490,904V656H510V904C510,949,570,949,570,904V656H655L565,326H581L633,514C645,557,698,538,686,494L629,290C621,267,593,227,546,225H454C406,227,379,267,372,290zM571,135C571,95,539,62,500,62C461,62,429,95,429,135C429,175,461,208,500,208C539,208,571,175,571,135z',
      'M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z',
    ],
  }),
  computed: {
    data() {
      return this.$store.state.data;
    },
  },
  mounted() {
    const counter = {};
    this.data.forEach((movie) => {
      this.jobs.forEach((job) => {
        movie.persons[job].forEach((person) => {
          // Not specified
          if (person.gender === 0) {
            return;
          }
          counter[job] = counter[job] || {};
          counter[job][person.gender] = counter[job][person.gender] || { total: 0, value: 0 };
          counter[job][person.gender].total = counter[job][person.gender].total + 1 || 1;
          if (parseInt(movie.rating, 10) === 3) {
            counter[job][person.gender].value = counter[job][person.gender].value + 1 || 1;
          }
        });
      });
    });
    this.jobs.forEach((job, iJob) => {
      this.processedData[job] = Object.keys(counter[job])
        .map(index => ([
          {
            name: 'Failed',
            value: (Math.round(
              (counter[job][index].total - counter[job][index].value)
              * 100 / counter[job][index].total * 100,
            ) / 100),
            color: am4core.color(Constants.PALETTE_COLORS[0]),
          },
          {
            name: 'Passed',
            value: Math.round(
              counter[job][index].value * 100 / counter[job][index].total * 100,
            ) / 100,
            color: am4core.color(Constants.PALETTE_COLORS[3]),
          },
        ]));

      Object.keys(this.processedData[job]).forEach((gender) => {
        const chart = am4core.create(`gender${iJob}${parseInt(gender, 10) + 1}`, am4charts.SlicedChart);
        chart.data = this.processedData[job][gender];
        chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
        const series = chart.series.push(new am4charts.PictorialStackedSeries());
        series.dataFields.value = 'value';
        series.dataFields.category = 'name';
        series.alignLabels = true;

        series.maskSprite.path = this.icons[parseInt(gender, 10) + 1];
        series.ticks.template.locationX = 1;
        series.ticks.template.locationY = 0.5;
        series.slices.template.propertyFields.fill = 'color';
        series.slices.template.propertyFields.stroke = 'color';

        series.labelsContainer.width = 100;
      });
    });
  },
};
</script>

<style scoped>
.genrechart {
  height: 350px;
}
h3, h4 {
  text-align: center;
}
h4 {
  margin-top: 35px;
}
</style>
