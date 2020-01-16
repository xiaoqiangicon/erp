import $ from 'jquery';
import indexData from '../../data';
import commonTpl from '../../tpl/common';
import calendarTpl from '../../tpl/calendar';
var util = {};
util.onRequestCalendarBuddhistOrArticleSuccess = function(res, tabIndex) {
  res.currentPage == 1
    ? ((indexData.misc.calendarBuddhist.totalCount = res.totalCount),
      (indexData.misc.calendarBuddhist.perPage = res.perPage),
      (indexData.misc.calendarBuddhist.totalPages = res.totalPages))
    : (res.currentPage <= 0 &&
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
  $contentContainer.html(htmlString);
  var i,
    il,
    pages = [],
    totalPages =
      res.totalPages || Math.ceil(res.totalCount / (res.perPage || 5));
  for (i = 0; i < totalPages; i++) pages.push(i + 1);
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
export default util;
