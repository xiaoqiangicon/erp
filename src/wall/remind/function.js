import seeAjax from 'see-ajax';
import $ from 'jquery';
import _ from 'underscore';
import commonFunc from 'common/function';
import commonTpl from 'common/tpl';
import data from './data';
import tpl from './tpl';
import './ajax';
var func = {};
var $contentBody = $('#content-body');
var $pagination = $('#pagination');
func.init = function() {
  seeAjax('messageInfo', {}, function(res) {
    if (res.success) {
      $('#remain-message-count').text(res.remainCount);
    }
  });
  seeAjax('regions', {}, function(res) {
    if (res.success && res.data && res.data.length) {
      var $select = $('#filter-region');
      res.data.map(function(item) {
        $select.append(tpl.regionCell.render(item));
      });
    }
  });
  func.requestOnlineOrdersList();
};
func.requestOnlineOrdersList = function(page) {
  $contentBody.html(commonTpl.loading);
  $pagination.html('');
  !page && (page = 1);
  var params = _.clone(data.onlineOrdersFilter);
  params.page = page;
  seeAjax('onlineOrders', params, function(res) {
    if (res.success) {
      $contentBody.html('');
      func.renderList(res, page);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.requestCustomOrdersList = function(page) {
  $contentBody.html(commonTpl.loading);
  $pagination.html('');
  !page && (page = 1);
  var params = _.clone(data.customOrdersFilter);
  params.page = page;
  seeAjax('customOrders', params, function(res) {
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
};
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
      $phoneContainer.append(
        tpl.sendInputCell.render({
          phone: phone,
        })
      );
    });
  }
  data.sendPopupSubmitCallback = callback;
  $('#send-popup').show();
};
export default func;
