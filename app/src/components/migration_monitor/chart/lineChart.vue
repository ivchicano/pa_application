<template>
  <svg :width="width" :height="height" :id="id">
    <g
      v-if="typeof width!=='string'"
      :transform="'translate(' + margin.left + ',' + margin.top + ')'"
    >
      <path :d="drawLine(lineData)" stroke="#ecbc3a" />
      <circle
        v-for="(d,i) in lineData"
        :key="i"
        :cx="scaleX(d[timeColumn])"
        :cy="scaleY(d[valueColumn])"
        :r="2"
        fill="#3490DC"
      />
      <rect
        v-for="(d,i) in lineData"
        :key="i+'_rect'"
        :id="i+'_rect'"
        :x="scaleX(d[timeColumn])-barWidth/2"
        :y="scaleY(d[valueColumn])"
        :width="barWidth"
        :height="height - scaleY(d[valueColumn]) - margin.top - margin.bottom"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
      />
      <text
        v-for="(d,i) in lineData"
        :key="i+'_label'"
        :ref="i+'_label'"
        class="label"
        :x="scaleX( d[timeColumn])+barWidth/2"
        :y="scaleY(d[valueColumn])"
        text-anchor="middle"
      >{{d[valueColumn]}}</text>
      <line
        v-for="(d,i) in lineData"
        class="line"
        :key="i+'_line'"
        :ref="i+'_line'"
        :x1="scaleX(d[timeColumn])"
        :x2="scaleX(d[timeColumn])"
        :y1="height-margin.top-margin.bottom"
        :y2="scaleY(d[valueColumn])"
        stroke-width="2"
      />
    </g>
    <text
      v-if="typeof width!=='string'"
      :x="-margin.top - height/2"
      :y="margin.left/2"
      text-anchor="middle"
      transform="rotate(-90)"
    >{{valueColumn}}</text>
    <text
      v-if="typeof width!=='string'"
      :x="width/2 "
      :y="height - margin.bottom/2.4"
      text-anchor="middle"
    >{{timeColumn}}</text>
    <ChartAxisBottom
      v-if="typeof width!=='string'"
      :scaleX="scaleX"
      :key="xid"
      :transform="'translate(' + margin.left + ', ' + (height - margin.bottom) + ')'"
    />
    <ChartAxisLeft
      :scaleY="scaleY"
      :key="yid"
      :transform="'translate(' + margin.left + ', ' + margin.top + ')'"
    />
  </svg>
</template>
<script>
import {
  scaleLinear,
  scaleTime,
  scaleBand,
  extent,
  select,
  line,
  axisBottom,
  axisLeft,
  curveCardinal,
} from "d3";
import ChartAxisBottom from "./ChartAxisBottom.vue";
import ChartAxisLeft from "./ChartAxisLeft.vue";

export default {
  name: "lineChart",
  components: {
    ChartAxisBottom,
    ChartAxisLeft,
  },
  props: {
    lineData: Array,
    timeColumn: String,
    valueColumn: String,
    xistime: Boolean,
  },
  data: function () {
    return {
      id: "lineSvg",
      margin: {
        left: 100,
        top: 30,
        right: 30,
        bottom: 60,
      },
      width: "100%",
      height: "300",
      xid: "x0",
      yid: "y0",
      timeout: false,
    };
  },
  computed: {
    svg: function () {
      return select("#" + this.id);
    },
    scaleX: function () {
      if (this.xistime) {
        return scaleTime()
          .domain(extent(this.lineData, (d) => d[this.timeColumn]))
          .range([0, this.width - this.margin.left - this.margin.right]);
      } else {
        return scaleBand()
          .domain(this.lineData.map((d) => d[this.timeColumn]))
          .range([0, this.width - this.margin.left - this.margin.right]);
      }
    },
    scaleY: function () {
      return (
        scaleLinear()
          // .domain(extent(this.lineData, d => d[this.valueColumn]))
          .domain([
            0,
            Math.max(...this.lineData.map((d) => d[this.valueColumn])),
          ])
          .range([this.height - this.margin.top - this.margin.bottom, 0])
      );
    },
    drawLine: function () {
      return line()
        .x((d) => this.scaleX(d[this.timeColumn]))
        .y((d) => this.scaleY(d[this.valueColumn]))
        .curve(curveCardinal);
    },
    barWidth: function () {
      return (
        (this.width - this.margin.left - this.margin.right) /
        this.lineData.length
      );
    },
  },
  methods: {
    updateGraph: function () {
      const client = this.$el.getBoundingClientRect();
      this.width = client.width;
      this.height = client.height;
      // force axes to update according to the size
      this.xid = this.xid === "x_0" ? "x_1" : "x_0";
      this.yid = this.yid === "y_0" ? "y_1" : "y_0";
    },
    onResize: function () {
      // clear the timeout
      clearTimeout(this.timeout);
      // start timing for event "completion"
      this.timeout = setTimeout(this.updateGraph, 250);
    },
    onMouseOver: function (event) {
      const line = this.$refs[event.target.id.split("_")[0] + "_line"][0],
        label = this.$refs[event.target.id.split("_")[0] + "_label"][0];
      label.style.opacity = 1;
      line.style.opacity = 1;
    },
    onMouseLeave: function (event) {
      const line = this.$refs[event.target.id.split("_")[0] + "_line"][0],
        label = this.$refs[event.target.id.split("_")[0] + "_label"][0];
      label.style.opacity = 0;
      line.style.opacity = 0;
    },
  },
  mounted: function () {
    // window.resize event listener
    window.addEventListener("resize", this.onResize);
    this.updateGraph();
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>
<style scoped>
svg {
  /* background-color: null;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
  border-radius: 5px; */
}
div {
  /* margin-top: 5%;
  margin-left: 5%; */
  background: white;
}
path {
  fill: none;
  stroke: #99e6b4;
  stroke-width: 3px;
}
.line,
.label {
  opacity: 0;
  transition: 0.2s;
}
.line {
  stroke: #f5b642;
}
rect {
  fill: none;
  pointer-events: all;
}
</style>
