import $ from 'jquery';
import _ from 'underscore';
import Chart from 'chart.js';
import commonTpl from 'common/tpl';
import commonData from './data';

var chart;
var chartConfig;
var chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(33, 204, 33)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(231,233,237)',
};
var chartMonths = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];

export const renderChart = data => {
  const $el = $('#chart-section-canvas');

  for (var i = 0, il = 12; i < il; i++) {
    typeof data.months[i] == 'undefined' && (data.months[i] = 0);
  }
  var total = _.reduce(
      data.months,
      function(memo, num) {
        return memo + num;
      },
      0
    ),
    titleText = data.year + '年统计报表  ¥' + total.toFixed(2);
  if (!chart) {
    chartConfig = {
      type: 'line',
      data: {
        labels: chartMonths,
        datasets: [
          {
            label: '统计报表',
            backgroundColor: chartColors.green,
            borderColor: chartColors.green,
            data: data.months,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: titleText,
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          displayColors: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: '月',
              },
            },
          ],
          yAxes: [
            {
              display: true,
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: '元',
              },
            },
          ],
        },
      },
    };
    chart = new Chart($el[0].getContext('2d'), chartConfig);
  } else {
    chart.options.title.text = titleText;
    chart.data.datasets[0].data = data.months;
    chart.update();
  }
};

export const renderTotalDonate = data => {
  $('#total-donate').text(data);
};

export const renderAvailableDonate = data => {
  $('#available-donate').text(data);
};

export const renderTakenDonate = data => {
  $('#taken-donate').text(data);
};

export const renderChanzaiDonate = data => {
  $('#chanzai-donate').text(data);
};

export const renderSelectedYear = data => {
  $('[data-selected-year]')
    .attr({
      'data-selected-year': data,
    })
    .text(data + '年');
};

export const renderPaginationContent = (data, options) => {
  const $el = $(`[data-pagination-content][data-year="${options.year}"]`);

  var htmlString = '';
  data.map(function(item) {
    htmlString += commonData.tpl.detailUnit.render(item);
  });
  $el.html(htmlString || commonTpl.noData);
};
