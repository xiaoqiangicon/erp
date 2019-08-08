/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  './data',
  './tpl',
  '../../../old-com/pagination/src',
  './ajax',
], function($, commonFunc, data, tpl, Pagination) {
  var func = {};

  func.init = function() {
    func.requestList(1);
  };

  // 请求列表
  func.requestList = function(currentPage) {
    typeof currentPage == 'undefined' && (currentPage = 1);
    $.seeAjax.get(
      'list',
      {
        page: currentPage,
      },
      function(res) {
        res.success
          ? (function() {
              func.renderList(res, currentPage);
            })()
          : res.message && commonFunc.alert(res.message);
      }
    );
  };

  // 渲染列表
  func.renderList = function(res, currentPage) {
    var $contentContainer = $('[data-container="condition-content"]'),
      htmlString = '';
    // 渲染数据
    res.data.map(function(item) {
      htmlString += tpl.articleCell.render(item);
    });
    !htmlString &&
      (htmlString = tpl.paginationContentContainerEmpty.render({}));
    $contentContainer.html(htmlString);
    func.renderPagination(currentPage, res.total);
  };
  // 调用分页器
  func.renderPagination = function(currentPage, totalCount) {
    var pageSize = 25;
    var totalPages = Math.ceil(totalCount / pageSize);
    var pagination = new Pagination($('#pagination-container'), {
      onChange: function(pagetoChange) {
        // 回调中调用currentPage获取的是点击前的页数
        func.requestList(pagetoChange);
        pagination.render();
      }, // 切换页码回调函数，页面以 1 开始索引
      showDesc: !1, // 是否显示左边（共多少条，每页多少条的信息）
      showGoTo: !1, // 是否显示右边跳转到某一页
      currentPage: currentPage, // 初始化当前页
      totalPages: totalPages, // 总页数
      totalCount: totalCount, // 总条数
      perPage: pageSize, // 每页条数
    });
    pagination.render();
  };

  return func;
});
