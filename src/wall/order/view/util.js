/**
 * Created by senntyou on 2017/12/13.
 */

define(['jquery', '../function', '../data'], function($, func, data) {
  var util = {};

  // 重新请求当前页
  util.refreshCurrentPage = function() {
    var currentPage = parseInt(
      $('.pagination-cell.active').attr('data-current-page')
    );
    if (data.currentTabType == 1) {
      func.requestUnhandledOrdersList(currentPage);
    } else {
      func.requestHandledOrdersList(currentPage);
    }
  };

  return util;
});
