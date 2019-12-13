import seeAjax from 'see-ajax';
import $ from 'jquery';
import Pagination from '../../component/pagination';
import commonFunc from 'common/function';
import commonTpl from 'common/tpl';
import data from './data';
import tpl from './tpl';
import './ajax';
import 'lib/bootstrap-material-datetimepicker';
var func = {};
func.init = function() {
  $('[data-time-input]').bootstrapMaterialDatePicker({
    time: false,
    lang: 'zh-cn',
    cancelText: '取消',
    okText: '确定',
    clearText: '清除',
    nowText: '现在',
    clearButton: true,
  });
  func.requestState();
  func.requestList();
};
func.requestState = function() {
  seeAjax('state', {}, function(res) {
    res.success
      ? ($('#total-donate').text(res.totalDonate || 0),
        $('#month-donate').text(res.monthDonate || 0),
        $('#day-donate').text(res.dayDonate || 0))
      : res.message &&
        $.alert({
          title: false,
          content: (!!res.message ? res.message : '未知错误') + '，请重新尝试',
          buttons: {
            ok: {
              text: '确定',
            },
          },
          theme: 'white',
        });
  });
};
const $listContainer = $('#list-container');
const $paginationContainer = $('#pagination-container');
const requestList = (page = 1, init = !0) => {
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
        html += tpl.payCell.render(item);
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
      $(window).scrollTop(0);
    }
  );
};
func.requestList = requestList;
export default func;
