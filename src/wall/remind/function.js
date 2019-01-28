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
    // 短信统计信息
    $.seeAjax.get('messageInfo', {}, function(res) {
      if (res.success) {
        $('#remain-message-count').text(res.remainCount);
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
    func.requestOnlineOrdersList();
  };

  // 请求在线订单列表
  func.requestOnlineOrdersList = function(page) {
    // 清空容器
    $contentBody.html(commonTpl.loading);
    $pagination.html('');

    !page && (page = 1);

    var params = _.clone(data.onlineOrdersFilter);
    params.page = page;

    $.seeAjax.get('onlineOrders', params, function(res) {
      if (res.success) {
        $contentBody.html('');
        func.renderList(res, page);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };
  // 请求自录订单列表
  func.requestCustomOrdersList = function(page) {
    // 清空容器
    $contentBody.html(commonTpl.loading);
    $pagination.html('');

    !page && (page = 1);

    var params = _.clone(data.customOrdersFilter);
    params.page = page;

    $.seeAjax.get('customOrders', params, function(res) {
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
  };

  // 显示发送弹框
  func.showSendPopup = function(initData, callback) {
    var $input = $('#send-popup-input'),
      $inputCount = $('#send-popup-input-count'),
      $phoneContainer = $('#send-popup-phones');
    if (initData.content) {
      $input.val(initData.content);
      $inputCount.text(initData.content.length);
    } else {
      $input.val('');
      $inputCount.text(0);
    }

    $phoneContainer.html('');
    if (initData.phones) {
      initData.phones.map(function(phone) {
        $phoneContainer.append(tpl.sendInputCell.render({ phone: phone }));
      });
    }

    data.sendPopupSubmitCallback = callback;

    $('#send-popup').show();
  };

  return func;
});
