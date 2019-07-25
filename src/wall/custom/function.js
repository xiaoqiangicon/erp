/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'underscore',
  'common/function',
  'common/tpl',
  './data',
  './tpl',
  './ajax',
], function($, _, commonFunc, commonTpl, data, tpl) {
  var func = {};

  var $contentBody = $('#content-body');
  var $pagination = $('#pagination');

  // 初始化操作
  func.init = function() {
    // 大殿
    $.seeAjax.get('houses', {}, function(res) {
      if (res.success && res.data && res.data.length) {
        var $select = $('#filter-house');
        res.data.map(function(item) {
          item.id = item.name;
          $select.append(tpl.option.render(item));
        });
      }
    });
    // 区域
    $.seeAjax.get('regions', {}, function(res) {
      if (res.success && res.data && res.data.length) {
        var $select = $('#filter-region');
        res.data.map(function(item) {
          $select.append(tpl.regionCell.render(item));
        });
      }
    });
    // 初始化请求列表
    func.requestOrdersList();
  };

  // 请求在线订单列表
  func.requestOrdersList = function(page) {
    // 清空容器
    $contentBody.html(commonTpl.loading);
    $pagination.html('');

    !page && (page = 1);

    var params = _.clone(data.ordersFilter);
    params.page = page;

    $.seeAjax.get('orders', params, function(res) {
      if (res.success) {
        // 存储数据
        res.data &&
          res.data.length &&
          res.data.map(function(item) {
            data.listData[item.id] = item;
          });

        $contentBody.html('');
        func.renderList(res, page);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };

  // 渲染列表
  func.renderList = function(res, page) {
    if (res.data && res.data.length) {
      res.data.map(function(item) {
        $contentBody.append(tpl.row.render(item));
      });

      var i,
        il,
        pages = [];
      for (i = 0, il = res.totalPages; i < il; i++) pages.push(i + 1);
      $pagination.html(
        tpl.pagination.render({
          currentPage: page,
          totalPages: res.totalPages,
          pages: pages,
        })
      );
    } else {
      $contentBody.html(commonTpl.noData);
    }
  };

  return func;
});
