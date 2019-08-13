import $ from 'jquery';
import _ from 'underscore';
import Chart from 'chart.js';
import commonTpl from 'common/tpl';
import commonData from './data';
import 'lib/jquery.seeBind';
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
$.seeBind.bind('chart', '#chart-section-canvas', function($el, data) {
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
    titleText = data.year + '年筹集善款  ¥' + total.toFixed(2);
  if (!chart) {
    chartConfig = {
      type: 'line',
      data: {
        labels: chartMonths,
        datasets: [
          {
            label: '筹集善款',
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
});
$.seeBind.bind('total-donate', '#total-donate', 'text');
$.seeBind.bind('available-donate', '#available-donate', 'text');
$.seeBind.bind('taken-donate', '#taken-donate', 'text');
$.seeBind.bind('chanzai-donate', '#chanzai-donate', 'text');
$.seeBind.bind('data-selected-year', '[data-selected-year]', function(
  $el,
  year
) {
  $el
    .attr({
      'data-selected-year': year,
    })
    .text(year + '年');
});
$.seeBind.bind(
  'pagination-content',
  '[data-pagination-content="{{page}}"][data-year="{{year}}"]',
  function($el, data) {
    var htmlString = '';
    data.map(function(item) {
      htmlString += commonData.tpl.detailUnit.render(item);
    });
    $el.html(htmlString || commonTpl.noData);
  }
);
$.seeBind.bind('pagination', '[data-pagination="{{year}}"]', function(
  $el,
  data
) {
  var i = 1,
    il = data.totalPages;
  data.pages = [];
  for (; i <= il; i++) data.pages.push(i);
  $el.html(commonData.tpl.pagination.render(data));
});
