import { chartColors, months } from './data';

const defaultChartData = '.'
  .repeat(12)
  .split('')
  .map(() => 10);

const defaultVisitData = '.'
  .repeat(12)
  .split('')
  .map(() => 8);

const defaultpayMoneyData = '.'
  .repeat(12)
  .split('')
  .map(() => 4);

export const makeChartTitle = ({ year, total }) =>
  `${year}年筹集善款  ¥${total || 0}`;

export const makeChartConfig = ({ chartData }) => ({
  type: 'line',
  data: {
    labels: months,
    datasets: [
      {
        label: '进入人数',
        backgroundColor: '#108de9',
        borderColor: '#108de9',
        data: chartData && chartData.length ? chartData : defaultVisitData,
        fill: false,
      },
      {
        label: '离开人数',
        backgroundColor: chartColors.green,
        borderColor: chartColors.green,
        data: chartData && chartData.length ? chartData : defaultChartData,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    title: {
      display: false,
      // text: makeChartTitle({ year, total }),
    },
    tooltips: {
      mode: 'index',
      intersect: true,
      displayColors: false,
      position: 'nearest',
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
            // labelString: '月',
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
            labelString: '人',
          },
        },
      ],
    },
  },
});

export const formatTime = timeStr => {
  const date = new Date(timeStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return `${y}-${m >= 10 ? m : `0${m}`}-${d >= 10 ? d : `0${d}`}`;
};

export const getAll = (begin, end) => {
  const ab = begin.split('-');
  const ae = end.split('-');
  const db = new Date();
  db.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
  const de = new Date();
  de.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  const unixDb = db.getTime();
  const unixDe = de.getTime();
  const result = [];

  // eslint-disable-next-line
  for (let k = unixDb; k <= unixDe; ) {
    result.push(new Date(parseInt(k, 10)).formatTime());
    k += 24 * 60 * 60 * 1000;
  }
};

export const getTenDays = begin => {
  const ab = begin.split('-');
  const de = new Date();
  de.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
  const unixTen = de.getTime();
  return unixTen + 24 * 60 * 60 * 1000 * 10;
};
