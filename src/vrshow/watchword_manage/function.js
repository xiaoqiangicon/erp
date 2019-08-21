import seeAjax from 'see-ajax';
import $ from 'jquery';
import commonFunc from 'common/function';
import data from './data';
import tpl from './tpl';
import Pagination from '../../../old-com/pagination/src';
import './ajax';
import 'bootstrap-select';
var func = {};
func.init = function() {
  $('#loading-toast').addClass('hide');
  func.getList(data.getListParams, function(res) {
    func.renderList(res);
  });
};
func.getList = function(params, callback) {
  seeAjax('getList', params, function(res) {
    if (res.success) {
      data.getListRes = res;
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.renderList = function(res) {
  var $container = $('#watchword-list-container'),
    htmlStr = '';
  res.data.map(function(item) {
    htmlStr += tpl.tableCell.render(item);
  });
  !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
  $container.html(htmlStr);
  if (res.total) {
    func.createPagination(res.total, data.getListParams.pageNum);
  } else {
    $('#pagination-container').html('');
  }
};
func.createPagination = function(totalCount, currentPage) {
  var totalPages = Math.ceil(totalCount / data.getListParams.pageSize),
    pagination = new Pagination($('#pagination-container'), {
      onChange: function(pageToChange) {
        data.getListParams.pageNum = pageToChange - 1;
        func.getList(data.getListParams, function(res) {
          func.renderList(res);
        });
      },
      showDesc: !1,
      showGoTo: !1,
      currentPage: currentPage + 1,
      totalPages: totalPages,
      totalCount: totalCount,
      perPage: data.getListParams.pageSize,
    });
  pagination.render();
};
func.updateWatchword = function(params, callback) {
  seeAjax('updateWatchword', params, function(res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.operateWatchword = function(params, callback) {
  seeAjax('operateWatchword', params, function(res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
export default func;
