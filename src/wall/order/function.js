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
  './util/refresh_selected_count',
  './ajax',
  'datepicker_zh',
], function($, _, commonFunc, commonTpl, data, tpl, refreshSelectedCount) {
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
    // 初始化日期选择
    $('[data-time-input]').datepicker({
      format: 'yyyy-mm-dd',
      language: 'zh-CN',
      autoclose: true,
      forceParse: !1,
    });
    // 初始化请求列表
    func.requestUnhandledOrdersList();

    // 打印机列表
    $.seeAjax.get('printers', {}, function(res) {
      if (res.success) {
        var $container = $('#printer-popup-printers');
        res.data &&
          res.data.length &&
          res.data.map(function(item) {
            $container.append(tpl.printerCell.render(item));
          });
        res.data && res.data.length && func.requestPrinterStatus(res.data);
      }
    });
  };

  // 请求在线订单列表
  func.requestUnhandledOrdersList = function(page) {
    // 清空容器
    $contentBody.html(commonTpl.loading);
    $pagination.html('');

    !page && (page = 1);

    var params = _.clone(data.unhandledOrdersFilter);
    params.page = page;

    data.currentPage = page;

    $.seeAjax.get('unhandledOrders', params, function(res) {
      if (res.success) {
        // 更新 tab 处的未处理订单数
        var $unhandledCount = $('#unhandled-count');
        if (res.totalCount) {
          $unhandledCount.text(res.totalCount).removeClass('hide');
        } else {
          $unhandledCount.text(0).addClass('hide');
        }
        $contentBody.html('');
        func.renderList(res, page);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 请求自录订单列表
  func.requestHandledOrdersList = function(page) {
    // 清空容器
    $contentBody.html(commonTpl.loading);
    $pagination.html('');

    !page && (page = 1);

    var params = _.clone(data.handledOrdersFilter);
    params.page = page;

    data.currentPage = page;

    $.seeAjax.get('handledOrders', params, function(res) {
      if (res.success) {
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

    // 设置全选按钮为未选中状态
    $('#select-all').removeClass('active');
    refreshSelectedCount();
  };

  // 请求打印机状态
  func.requestPrinterStatus = function(items) {
    items.map(function(item) {
      // 请求打印机状态
      $.seeAjax.post(
        'printerStatus',
        { id: item.id },
        function(res) {
          var $status = $('[data-printer-cell-status="' + item.id + '"]');
          $status.text(res.message);
          $status.addClass(res.success ? 'green' : 'red');
          $status.removeClass('hide');
        },
        !0
      );
    });
  };

  return func;
});
