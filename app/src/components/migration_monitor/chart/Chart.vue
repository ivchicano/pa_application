<template>
  <div id="card">
    <q-tooltip>
      <div class="info">
        <div class="info-content">
          <p>
            <strong>description:</strong>
            {{graphData.description}}
          </p>
          <p>
            <strong>data provider:</strong>EU
          </p>
          <p>
            <strong>updated time:</strong>2019.07
          </p>
        </div>
      </div>
    </q-tooltip>

    <lineChart
      v-if="graphData.type==='LINE'"
      class="chart"
      :lineData="graphData.content"
      :timeColumn="graphData.x"
      :valueColumn="graphData.y"
      :xistime="graphData.xistime"
    />
    <barChart
      v-if="graphData.type==='BAR'"
      class="chart"
      :lineData="graphData.content"
      :timeColumn="graphData.x"
      :valueColumn="graphData.y"
      :xistime="graphData.xistime"
    />
    <pieChart
      v-if="graphData.type==='PIE'"
      class="chart"
      :pieData="graphData.content"
      :labelColumn="graphData.x"
      :valueColumn="graphData.y"
    />
    <mapChart v-if="graphData.type==='MAP'" class="chart" />
    <h6>{{graphData.title}}</h6>
  </div>
</template>

<script>
import { Style, Stroke, Fill } from "ol/style.js";
import * as mpapi from "masterportalAPI";
import lineChart from "./lineChart";
import pieChart from "./pieChart";
import barChart from "./barChart";
import mapChart from "./mapChart";

export default {
  name: "MigrationSituation",
  components: {
    lineChart,
    pieChart,
    barChart,
    mapChart,
  },
  props: ["graphData"],
  data: function () {
    return {};
  },
  computed: {},
  mounted: function () {},
};
</script>

<style scoped>
#card {
  height: 350px;
  margin: auto;
  width: 97%;
  margin-top: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
}
.info-content {
  font-size: 1rem;
  /* margin: 50px; */
}
h6 {
  margin: 0;
  text-align: center;
}
.chart {
  display: block;
  margin: auto;
}
</style>
