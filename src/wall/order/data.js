/**
 * Created by senntyou on 2017/8/3.
 */

define(function() {
  var data = {
    // 未处理订单过滤记录
    unhandledOrdersFilter: {
      regionId: 0,
      startDate: '',
      endDate: '',
      search: '',
      searchType: 1,
    },
    // 已处理订单过滤记录
    handledOrdersFilter: {
      regionId: 0,
      startDate: '',
      endDate: '',
      search: '',
      searchType: 1,
    },
    // 当前 tab type，默认线上订单（1：未处理订单，2：已处理订单）
    currentTabType: 1,
    // 当前详情弹出框的订单ID
    currentDetailPopupId: 0,
    // 详情弹出框的保存文字
    detailPopupSaveTexts: ['设为已处理', '设为未处理'],
    // 当前的打印联数（默认2联）
    currentPrinterPages: 2,
    // 当前页面
    currentPage: 1,
  };

  return data;
});
