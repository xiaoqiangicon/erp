/**
 * Created by senntyou on 2017/3/29.
 */
define([
  'jquery',
  'underscore',
  'common/tpl',
  'component/pagination',
  './tpl',
  './data',
  './ajax',
], function($, _, commonTpl, Pagination, tpl, data) {
  var func = {};

  var pagination;
  var $contentBody = $('#content-body');
  var $paginationContainer = $('#pagination-container');

  /**
   * 初始化
   */
  func.init = function() {
    func.requestList();
  };

  /**
   * 请求列表信息
   * @param page
   * @param init 是否是初始化分页
   */
  func.requestList = function(page, init) {
    !page && (page = 1);
    typeof init == 'undefined' && (init = !0);

    $contentBody.html(commonTpl.loading);
    init && $paginationContainer.html('');

    var params = _.clone(data.filter);

    params.page = page;

    $.seeAjax.get('list', params, function(res) {
      if (res.success && res.data.length) {
        func.renderList(res.data);
        init && func.initPagination(res.totalPages);
      } else {
        $contentBody.html(commonTpl.noData);
      }
    });
  };

  // 渲染列表
  func.renderList = function(items) {
    $contentBody.html('');
    items.map(function(item) {
      data.listItems[item.id] = item;
      $contentBody.append(tpl.unit.render(item));
    });
  };

  // 初始化分页组件
  func.initPagination = function(totalPages) {
    pagination = new Pagination('#pagination-container', {
      totalPages: totalPages,
      onChange: function(page) {
        func.requestList(page, !1);
        pagination.render();
      },
    });
    pagination.render();
  };

  return func;
});
