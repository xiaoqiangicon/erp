import $ from "jquery";
import indexData from "../../data";
import swipeTpl from "../../tpl/swipe_list";
var util = {};
util.onRequestBuddhistOrArticleSuccess = function (res, id, type) {
  res.currentPage == 1 ? (indexData.misc.paginationStat[type].totalCount = res.totalCount, indexData.misc.paginationStat[type].perPage = res.perPage, indexData.misc.paginationStat[type].totalPages = res.totalPages) : (res.currentPage <= 0 && (res.currentPage = indexData.misc.paginationStat[type].totalPages), res.totalCount = indexData.misc.paginationStat[type].totalCount, res.perPage = indexData.misc.paginationStat[type].perPage, res.totalPages = indexData.misc.paginationStat[type].totalPages);
  var $contentContainer = $("[data-swipe-list-pagination-content=\"" + id + "\"][data-type=\"" + type + "\"][data-pagination-index=\"" + (res.currentPage || 1) + "\"]"), $paginationContainer = $("[data-swipe-list-pagination=\"" + id + "\"][data-type=\"" + type + "\"]"), htmlString = "";
  res.data.map(function (item) {
    item.type = type;
    item.componentId = id;
    htmlString += swipeTpl.editPopupPaginationContentCell.render(item);
  });
  $contentContainer.html(htmlString);
  var i, il, pages = [], totalPages = res.totalPages || Math.ceil(res.totalCount / (res.perPage || 5));
  for (i = 0; i < totalPages; i++) pages.push(i + 1);
  $paginationContainer.html(swipeTpl.editPopupPagination.render({
    totalCount: res.totalCount,
    perPage: res.perPage || 5,
    currentPage: res.currentPage || 1,
    totalPages: totalPages,
    pages: pages,
    id: id,
    type: type
  }));
};
export default util;
