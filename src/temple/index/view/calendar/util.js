/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  '../../data',
  '../../tpl/common',
  '../../tpl/calendar',
], function($, indexData, commonTpl, calendarTpl) {
  var util = {};

  // 请求佛历组件的佛事完成后
  util.onRequestCalendarBuddhistOrArticleSuccess = function(res, tabIndex) {
    res.currentPage == 1
      ? ((indexData.misc.calendarBuddhist.totalCount = res.totalCount),
        (indexData.misc.calendarBuddhist.perPage = res.perPage),
        (indexData.misc.calendarBuddhist.totalPages = res.totalPages))
      : // 总数大于1，而且是最后一个，返回的是0，纠正这个数据
        (res.currentPage <= 0 &&
          (res.currentPage = indexData.misc.calendarBuddhist.totalPages),
        (res.totalCount = indexData.misc.calendarBuddhist.totalCount),
        (res.perPage = indexData.misc.calendarBuddhist.perPage),
        (res.totalPages = indexData.misc.calendarBuddhist.totalPages));
    var $contentContainer = $(
        '[data-calendar-buddhist-pagination-content][data-tab-index="' +
          tabIndex +
          '"][data-calendar-buddhist-pagination-index="' +
          (res.currentPage || 1) +
          '"]'
      ),
      $paginationContainer = $(
        '[data-calendar-buddhist-pagination][data-tab-index="' + tabIndex + '"]'
      ),
      htmlString = '';

    res.data.map(function(item) {
      item.tabIndex = tabIndex;
      htmlString += calendarTpl.editBuddhistPopupPaginationContentCell.render(
        item
      );
    });
    // 创建内容
    $contentContainer.html(htmlString);
    var i,
      il,
      pages = [],
      totalPages =
        res.totalPages || Math.ceil(res.totalCount / (res.perPage || 5));
    for (i = 0; i < totalPages; i++) pages.push(i + 1);
    // 创建分页

    $paginationContainer.html(
      calendarTpl.editBuddhistPopupPagination.render({
        totalCount: res.totalCount,
        perPage: res.perPage || 5,
        currentPage: res.currentPage || 1,
        totalPages: totalPages,
        pages: pages,
        tabIndex: tabIndex,
      })
    );
  };

  return util;
});
