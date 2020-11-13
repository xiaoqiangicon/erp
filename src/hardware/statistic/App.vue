<template>
  <div class="contain">
    <el-card>
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        unlink-panels
        @change="onChangeDatePicker"
      />
      <div class="" v-show="originData.length">
        <canvas width="600" height="300" class="canvas" ref="chart" />
      </div>
      <div class="no-data" v-show="!originData.length">
        暂无数据哦~
      </div>
    </el-card>
  </div>
</template>

<script>
import seeAjax from 'see-ajax';
import { Notification } from 'element-ui';
import moment from 'moment';
import Chart from 'chart.js';
import {
  formatTime,
  getAll,
  makeChartConfig,
  makeChartTitle,
  makeChartData,
  getTenDays,
} from './util';

let chart;

export default {
  name: 'APP',
  data() {
    return {
      date: ['', ''],
      formatDate: ['', ''],
      chartData: [],
      xAxis: [],

      originData: [], // 获取原始图表数据
    };
  },
  created() {
    const oDate = new Date();
    this.date[0] = oDate;
    this.date[1] = oDate;
    this.formatDate = this.date.map(item => this.formatTime(`${item}`));

    this.fetchInfo();
  },
  mounted() {
    const { chart: chartRef } = this.$refs;
    console.log(chartRef);
    if (chartRef) {
      chart = new Chart(chartRef.getContext('2d'), this.makeChartConfig());
    }
  },
  beforeDestroy() {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  },
  methods: {
    fetchInfo() {
      seeAjax(
        'info',
        { startDate: this.formatDate[0], endDate: this.formatDate[1] },
        res => {
          if (res.result === 0) {
            this.originData = res.data;

            if (!this.originData.length) return;
            let type;
            if (this.formatDate[0] === this.formatDate[1]) {
              type = 1;
            } else {
              type = 2;
            }

            let enterList = [];
            this.xAxis = [];
            res.enterList.forEach((item, i) => {
              enterList.push(item[1]);

              var m = moment(item[0]);
              if (type === 1) {
                this.xAxis.push(i + '时');
              } else {
                this.xAxis.push(m.format('MM') + '月' + m.format('D') + '日');
              }
            });
            let leaveList = [];
            res.leaveList.forEach(item => {
              leaveList.push(item[1]);
            });

            chart.data.datasets[0].data = enterList;
            chart.data.datasets[1].data = leaveList;

            chart.data.labels = this.xAxis;
            chart.update();
          }
        }
      );
    },
    onChangeDatePicker() {
      const { date } = this;
      this.formatDate = date.map(item => this.formatTime(`${item}`));
      this.fetchInfo();
    },
    getLocalTime(nS) {
      return new Date(parseInt(nS) * 1000)
        .toLocaleString()
        .replace(/:\d{1,2}$/, ' ');
    },
    formatTime(timeStr) {
      const date = new Date(timeStr);
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();

      return `${y}-${m >= 10 ? m : `0${m}`}-${d >= 10 ? d : `0${d}`}`;
    },
    makeChartConfig() {
      return makeChartConfig({
        chartData: this.chartData,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.contain {
  padding: 20px;
}
.content {
  display: flex;
  justify-content: space-between;
}

.canvas {
  width: 800px;
  height: 400px;
  margin-top: 30px;
}
.no-data {
  margin-top: 100px;
  margin-left: 140px;
  padding-bottom: 100px;
  font-size: 18px;
  font-weight: bold;
}
</style>
