/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  '@zzh/pagination',
  'common/function',
  'common/tpl',
  './data',
  './tpl',
  './ajax',
  'lib/bootstrap-material-datetimepicker',
], function($, Pagination, commonFunc, commonTpl, data, tpl) {
  var func = {};

  func.init = function() {
    $('[data-time-input]').bootstrapMaterialDatePicker({
      time: false,
      lang: 'zh-cn',
      cancelText: '取消',
      okText: '确定',
      clearText: '清除',
      nowText: '现在',
      clearButton: true,
    });

    func.requestState();
    func.requestList();
  };

  // 请求统计信息
  func.requestState = function() {
    $.seeAjax.get('state', {}, function(res) {
      res.success
        ? ($('#total-donate').text(res.totalDonate || 0),
          $('#month-donate').text(res.monthDonate || 0),
          $('#day-donate').text(res.dayDonate || 0))
        : res.message &&
          $.alert({
            title: false,
            content:
              (!!res.message ? res.message : '未知错误') + '，请重新尝试',
            buttons: { ok: { text: '确定' } },
            theme: 'white',
          });
    });
  };

  const $listContainer = $('#list-container');
  const $paginationContainer = $('#pagination-container');

  const requestList = (page = 1, init = !0) => {
    $listContainer.html(commonTpl.loading);
    init && $paginationContainer.html('');

    $.seeAjax.get('list', { ...data.filter, page }, res => {
      if (!res.success || !res.data || !res.data.length) {
        $listContainer.html(commonTpl.noData);
        return;
      }

      let html = '';
      // 渲染数据
      res.data.map(function(item) {
        html += tpl.payCell.render(item);
      });
      $listContainer.html(html);

      if (init) {
        data.pagination = new Pagination('#pagination-container', {
          totalPages: res.totalPages,
          onChange: page => {
            requestList(page, !1);
            data.pagination.render();
          },
        });
        data.pagination.render();
      }

      $(window).scrollTop(0);
    });
  };

  // 请求列表
  func.requestList = requestList;

  return func;
});
