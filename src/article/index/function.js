import $ from 'jquery';
import seeAjax from 'see-ajax';
import Pagination from '../../../old-com/pagination/src';
import commonFunc from 'common/function';
import commonTpl from 'common/tpl';
import data from './data';
import tpl from './tpl';
import './ajax';
var func = {};
func.init = function() {
  seeAjax('categories', {}, function(res) {
    var $container = $('#category-dropdown-menu');
    if (res.success) {
      res.data.map(function(item) {
        $container.append(tpl.categoryCell.render(item));
      });
      func.requestList();
    }
  });
};
const $listContainer = $('#list-container');
const $paginationContainer = $('#pagination-container');
const requestList = (page = 1, init = !0, callback) => {
  $listContainer.html(commonTpl.loading);
  init && $paginationContainer.html('');
  seeAjax(
    'list',
    {
      ...data.filter,
      page,
    },
    res => {
      if (!res.success || !res.data || !res.data.length) {
        $listContainer.html(commonTpl.noData);
        return;
      }
      let html = '';
      res.data.map(function(item) {
        html += tpl.articleCell.render(item);
      });
      $listContainer.html(html);
      if (init) {
        data.pagination = new Pagination('#pagination-container', {
          totalPages: res.totalPages,
          onChange: page => {
            requestList(page, !1);
            data.pagination.render();
          },
        });
        data.pagination.render();
      }
      callback && callback(res);
      $(window).scrollTop(0);
    }
  );
};
func.sortAndRenderList = function($ele, params) {
  // 重置参数
  data.filter.orderView = 0;
  data.filter.orderLike = 0;
  data.filter.orderMoney = 0;
  var $icon = $ele.find('i');
  if ($icon.hasClass('unsort')) {
    data.filter[params] = 1;
    func.requestList(1, !1, function(res) {
      // 重置样式
      $('#article-visit-count')
        .find('i')
        .removeClass('desc')
        .removeClass('asc')
        .addClass('unsort');
      $('#article-support')
        .find('i')
        .removeClass('desc')
        .removeClass('asc')
        .addClass('unsort');
      $('#article-pay-amount')
        .find('i')
        .removeClass('desc')
        .removeClass('asc')
        .addClass('unsort');
      $icon.removeClass('unsort');
      $icon.addClass('desc');
    });
  } else if ($icon.hasClass('desc')) {
    data.filter[params] = 2;
    func.requestList(1, !1, function(res) {
      // 重置样式
      $('#article-visit-count')
        .find('i')
        .removeClass('desc')
        .removeClass('asc')
        .addClass('unsort');
      $('#article-support')
        .find('i')
        .removeClass('desc')
        .removeClass('asc')
        .addClass('unsort');
      $('#article-pay-amount')
        .find('i')
        .removeClass('desc')
        .removeClass('asc')
        .addClass('unsort');
      $icon.removeClass('desc');
      $icon.removeClass('unsort');
      $icon.addClass('asc');
    });
  } else {
    data.filter[params] = 0;
    func.requestList(1, !1, function(res) {
      // 重置样式
      $('#article-visit-count')
        .find('i')
        .removeClass('desc')
        .removeClass('asc')
        .addClass('unsort');
      $('#article-support')
        .find('i')
        .removeClass('desc')
        .removeClass('asc')
        .addClass('unsort');
      $('#article-pay-amount')
        .find('i')
        .removeClass('desc')
        .removeClass('asc')
        .addClass('unsort');
      $icon.removeClass('desc');
      $icon.addClass('unsort');
    });
  }
};
func.requestList = requestList;
export default func;
