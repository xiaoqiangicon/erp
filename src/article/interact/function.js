/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'common/function', './data', './tpl', './ajax'], function(
  $,
  commonFunc,
  data,
  tpl
) {
  var func = {};

  func.init = function() {
    $('[data-time-input]').datepicker({
      format: 'yyyy-mm-dd',
      language: 'zh-CN',
      autoclose: true,
      forceParse: !1,
    });

    func.requestList(1, '', '');
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
          : res.message && commonFunc.alert(res.message);
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
      data.totalPagesRecord[
        'startDate:' + startDate + '|endDate:' + endDate
      ] = currentPage;
    }
  };

  return func;
});
