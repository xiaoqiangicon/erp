/**
 * Created by senntyou on 2017/8/3.
 */

define(function() {
  var data = {
    // 线上订单过滤记录
    onlineOrdersFilter: {
      regionId: 0,
      remainDays: '',
    },
    // 自录订单过滤记录
    customOrdersFilter: {
      regionId: 0,
      remainDays: '',
    },
    // 当前 tab type，默认线上订单（1：线上订单，2：自录订单）
    currentTabType: 1,
    // 发送弹出框提交的回调函数
    sendPopupSubmitCallback: void 0,
  };

  return data;
});
