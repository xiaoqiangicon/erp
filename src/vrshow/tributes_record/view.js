/**
 * Created by kang on 2017/10/25.
 */

define([
  'jquery',
  'old/toast',
  './data',
  './tpl',
  './function',
  './ajax',
  'lib/jquery.seeView',
], function($, Toast, data, tpl, func) {
  $.seeView({
    events: {
      // 点击查询
      'click #query': 'query',
      // 点击重置
      'click #reset': 'reset',
      // 导出excel
      'click #export-excel': 'exportExcel',
      // 点击上一页
      'click #prevPage': 'onClickPrevPage',
      // 点击下一页
      'click #nextPage': 'onClickNextPage',
    },
    // 点击查询
    query: function(e) {
      var $beginDate = $('#beginDate'),
        beginDate = $beginDate.val(),
        $endDate = $('#endDate'),
        endDate = $endDate.val();
      data.pageNum = 0;
      data.getListParams.beginDate = beginDate;
      data.getListParams.endDate = endDate;
      func.getList(data.getListParams, function(res) {
        func.renderList(res);
      });
    },
    // 点击重置
    reset: function(e) {
      $('#beginDate').val('');
      $('#endDate').val('');
      $('#query').click();
    },
    // 导出excel
    exportExcel: function(e) {
      var $beginDate = $('#beginDate'),
        beginDate = $beginDate.val(),
        $endDate = $('#endDate'),
        endDate = $endDate.val();
      window.open(
        '/zzhadmin/vr_recordDownload/?startTime=' +
          beginDate +
          '&endTime=' +
          endDate
      );
    },
    // 点击上一页
    onClickPrevPage: function(e) {
      data.getListParams.pageNum -= 1;
      func.getList(data.getListParams, function(res) {
        func.renderList(res);
      });
    },
    // 点击下一页
    onClickNextPage: function(e) {
      data.getListParams.pageNum += 1;
      func.getList(data.getListParams, function(res) {
        func.renderList(res);
      });
    },
  });
});
