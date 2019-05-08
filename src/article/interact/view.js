/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  'common/variables',
  './data',
  './tpl',
  './function',
  './ajax',
  'lib/jquery.seeView',
], function($, commonFunc, commonVars, data, tpl, func) {
  $.seeView({
    events: {
      // 点击查询按钮
      'click #filter-submit': 'onClickFilterSubmit',
      // 点击导出
      'click #export': 'onClickExport',
    },
    // 点击查询按钮
    onClickFilterSubmit: function(e) {
      var $startDate = $('#filter-start-date'),
        startDate = $startDate.val(),
        startDateInt =
          !!startDate &&
          parseInt(
            startDate.slice(0, 4) +
              startDate.slice(5, 7) +
              startDate.slice(8, 10)
          ),
        $endDate = $('#filter-end-date'),
        endDate = $endDate.val(),
        endDateInt =
          !!endDate &&
          parseInt(
            endDate.slice(0, 4) + endDate.slice(5, 7) + endDate.slice(8, 10)
          );

      if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
        commonFunc.alert('您选择的起始时间大于了结束时间，请重新选择');
        return;
      }

      data.filter.startDate = startDate;
      data.filter.endDate = endDate;
      func.requestList();
    },
    // 点击导出
    onClickExport: function(e) {
      var $startDate = $('#filter-start-date'),
        startDate = $startDate.val(),
        startDateInt =
          !!startDate &&
          parseInt(
            startDate.slice(0, 4) +
              startDate.slice(5, 7) +
              startDate.slice(8, 10)
          ),
        $endDate = $('#filter-end-date'),
        endDate = $endDate.val(),
        endDateInt =
          !!endDate &&
          parseInt(
            endDate.slice(0, 4) + endDate.slice(5, 7) + endDate.slice(8, 10)
          );

      if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
        fn.alert('您选择的起始时间大于了结束时间，请重新选择');
        return;
      }

      window.open(
        '/zzhadmin/getArticleSuixiExcel/?startTime=' +
          startDate +
          '&endTime=' +
          endDate
      );
    },
  });
});
