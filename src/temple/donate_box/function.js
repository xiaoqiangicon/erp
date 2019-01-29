/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  './data',
  './tpl',
  './ajax',
  'lib/bootstrap-material-datetimepicker',
], function($, commonFunc, data, tpl) {
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
    func.requestList(1, '', '');
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

  // 请求列表
  func.requestList = function(currentPage, startDate, endDate) {
    typeof currentPage == 'undefined' && (currentPage = 1);
    typeof startDate == 'undefined' && (startDate = '');
    typeof endDate == 'undefined' && (endDate = '');

    $.seeAjax.get(
      'list',
      {
        page: currentPage,
        startDate: startDate,
        endDate: endDate,
      },
      function(res) {
        res.success
          ? func.renderList(res, currentPage, startDate, endDate)
          : res.message &&
            $.alert({
              title: false,
              content:
                (!!res.message ? res.message : '未知错误') + '，请重新尝试',
              buttons: { ok: { text: '确定' } },
              theme: 'white',
            });
      }
    );
  };

  // 渲染列表
  func.renderList = function(res, currentPage, startDate, endDate) {
    var $contentContainer = $(
        '[data-container="date-content"][data-start-date="' +
          startDate +
          '"][data-end-date="' +
          endDate +
          '"]'
      ).find(
        '[data-container="pagination-content"][data-page-index="' +
          currentPage +
          '"]'
      ),
      htmlString = '',
      $paginationContainer = $(
        '[data-container="pagination"][data-start-date="' +
          startDate +
          '"][data-end-date="' +
          endDate +
          '"]'
      );

    // 渲染数据
    res.data.map(function(item) {
      htmlString += tpl.payCell.render(item);
    });
    !htmlString &&
      (htmlString = tpl.paginationContentContainerEmpty.render({}));
    $contentContainer.html(htmlString);
    $paginationContainer.html(
      tpl.pagination.render({
        currentPage: currentPage,
        nextPage: res.nextPage,
        startDate: startDate,
        endDate: endDate,
      })
    );

    // 存储总页数的值
    if (res.nextPage <= 0) {
      data.totalPagesRecord['date:' + startDate + ':' + endDate] = currentPage;
    }
  };

  return func;
});
