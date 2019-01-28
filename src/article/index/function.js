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
    $.seeAjax.get('categories', {}, function(res) {
      var $container = $('#category-dropdown-menu');
      if (res.success) {
        res.data.map(function(item) {
          $container.append(tpl.categoryCell.render(item));
        });
        func.requestList(1, 0, 0, '');
      }
    });
  };

  // 请求列表
  func.requestList = function(currentPage, category, status, searchKey) {
    typeof currentPage == 'undefined' && (currentPage = 1);
    typeof category == 'undefined' && (category = 0);
    typeof status == 'undefined' && (status = 0);
    typeof searchKey == 'undefined' && (searchKey = '');

    $.seeAjax.get(
      'list',
      {
        page: currentPage,
        category: category,
        status: status,
        searchKey: searchKey,
      },
      function(res) {
        res.success
          ? func.renderList(res, currentPage, category, status, searchKey)
          : res.message && commonFunc.alert(res.message);
      }
    );
  };

  // 渲染列表
  func.renderList = function(res, currentPage, category, status, searchKey) {
    var $contentContainer = $(
        '[data-container="condition-content"][data-category="' +
          category +
          '"]' +
          '[data-status="' +
          status +
          '"][data-search-key="' +
          searchKey +
          '"]'
      ).find(
        '[data-container="pagination-content"][data-page-index="' +
          currentPage +
          '"]'
      ),
      htmlString = '',
      $paginationContainer = $(
        '[data-container="pagination"][data-category="' +
          category +
          '"]' +
          '[data-status="' +
          status +
          '"][data-search-key="' +
          searchKey +
          '"]'
      );

    // 渲染数据
    res.data.map(function(item) {
      htmlString += tpl.articleCell.render(item);
    });
    !htmlString &&
      (htmlString = tpl.paginationContentContainerEmpty.render({}));
    $contentContainer.html(htmlString);
    $paginationContainer.html(
      tpl.pagination.render({
        currentPage: currentPage,
        nextPage: res.nextPage,
        category: category,
        status: status,
        searchKey: searchKey,
      })
    );

    // 存储总页数的值
    if (res.nextPage <= 0) {
      data.totalPagesRecord[
        'category:' + category + '|status:' + status + '|searchKey' + searchKey
      ] = currentPage;
    }
  };

  return func;
});
