import $ from 'jquery';
import _ from 'underscore';
import commonFunc from 'common/function';
import commonTpl from 'common/tpl';
import data from './data';
import tpl from './tpl';
import refreshSelectedCount from './util/refresh_selected_count';
import './ajax';
var func = {};
var $contentBody = $('#content-body');
var $pagination = $('#pagination');
func.init = function() {
  $.seeAjax.get('houses', {}, function(res) {
    if (res.success && res.data && res.data.length) {
      var $select = $('#filter-house');
      res.data.map(function(item) {
        item.id = item.name;
        $select.append(tpl.option.render(item));
      });
    }
  });
  $.seeAjax.get('regions', {}, function(res) {
    if (res.success && res.data && res.data.length) {
      var $select = $('#filter-region');
      res.data.map(function(item) {
        $select.append(tpl.regionCell.render(item));
      });
    }
  });
  $('[data-time-input]').datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    forceParse: !1,
  });
  func.requestUnhandledOrdersList();
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
func.requestUnhandledOrdersList = function(page) {
  $contentBody.html(commonTpl.loading);
  $pagination.html('');
  !page && (page = 1);
  var params = _.clone(data.unhandledOrdersFilter);
  params.page = page;
  data.currentPage = page;
  $.seeAjax.get('unhandledOrders', params, function(res) {
    if (res.success) {
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
func.requestHandledOrdersList = function(page) {
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
  $('#select-all').removeClass('active');
  refreshSelectedCount();
};
func.requestPrinterStatus = function(items) {
  items.map(function(item) {
    $.seeAjax.post(
      'printerStatus',
      {
        id: item.id,
      },
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
export default func;
