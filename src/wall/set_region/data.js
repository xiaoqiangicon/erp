import $ from 'jquery';
var data = {
  winWidth: $(window).width(),
  priceTypeTexts: {
    6: '按天供奉',
    7: '按周供奉',
    1: '按月供奉',
    2: '按季供奉',
    3: '按年供奉',
    8: '十年供奉',
    5: '终身供奉',
  },
  priceData: {},
  rows: 0,
  columns: 0,
  currentBasePriceSetIndex: -1,
  regionName: '',
};
export default data;
