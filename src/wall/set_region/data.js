/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery'], function($) {
  var data = {
    // 窗体宽
    winWidth: $(window).width(),
    // 价格类型对应的文本
    priceTypeTexts: {
      6: '按天供奉',
      7: '按周供奉',
      1: '按月供奉',
      2: '按季供奉',
      3: '按年供奉',
      8: '十年供奉',
      5: '终身供奉',
    },
    // 价格集合
    priceData: {},
    // 行数
    rows: 0,
    // 列数
    columns: 0,
    // 当前基础价格设置的索引
    currentBasePriceSetIndex: -1,
    // 区域名称
    regionName: '',
  };

  return data;
});
