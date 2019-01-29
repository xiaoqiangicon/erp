/**
 * Created by senntyou on 2017/2/27.
 */
define(['jquery', '../../data', '../../tpl/swipe_list'], function(
  $,
  indexData,
  swipeTpl
) {
  var util = {};

  /**
   * 请求佛事成功后渲染视图
   * @param res 返回的数据
   * @param id 所属组件id
   * @param type 1: 佛事, 2: 文章
   */
  util.onRequestBuddhistOrArticleSuccess = function(res, id, type) {
    res.currentPage == 1
      ? ((indexData.misc.paginationStat[type].totalCount = res.totalCount),
        (indexData.misc.paginationStat[type].perPage = res.perPage),
        (indexData.misc.paginationStat[type].totalPages = res.totalPages))
      : // 总数大于1，而且是最后一个，返回的是0，纠正这个数据
        (res.currentPage <= 0 &&
          (res.currentPage = indexData.misc.paginationStat[type].totalPages),
        (res.totalCount = indexData.misc.paginationStat[type].totalCount),
        (res.perPage = indexData.misc.paginationStat[type].perPage),
        (res.totalPages = indexData.misc.paginationStat[type].totalPages));
    var $contentContainer = $(
        '[data-swipe-list-pagination-content="' +
          id +
          '"][data-type="' +
          type +
          '"][data-pagination-index="' +
          (res.currentPage || 1) +
          '"]'
      ),
      $paginationContainer = $(
        '[data-swipe-list-pagination="' + id + '"][data-type="' + type + '"]'
      ),
      htmlString = '';

    res.data.map(function(item) {
      item.type = type;
      item.componentId = id;
      htmlString += swipeTpl.editPopupPaginationContentCell.render(item);
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
      swipeTpl.editPopupPagination.render({
        totalCount: res.totalCount,
        perPage: res.perPage || 5,
        currentPage: res.currentPage || 1,
        totalPages: totalPages,
        pages: pages,
        id: id,
        type: type,
      })
    );
  };

  return util;
});
