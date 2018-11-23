import $ from 'jquery';
import seeAjax from 'see-ajax';
import Pagination from '@zzh/pagination';
import commonTpl from '../../common/tpl';
import { rowsTpl } from './tpl';

const $win = $(window);

export const requestInfo = () => {
  seeAjax('info', {}, res => {
    if (!res.success) return;

    $('#nickname').text(res.data.nickname);
    $('#name').text(res.data.name);
    $('#avatar').attr({ src: res.data.avatar });
    $('#phone').text(res.data.phone);
    $('#pending-income').text(res.data.pendingIncome);
    $('#got-income').text(res.data.gotIncome);
    $('#total-income').text(res.data.totalIncome);
    $('#promote-count').text(res.data.promoteCount);
    $('#intro').show();
  });
};

const $list = $('#list');
const $page = $('#page');
const $rowHead = $('#row-head');

let pagination;

export const filter = {
  status: 0,
  time: '',
};

export const requestList = (page = 1, init = !0) => {
  $list.html(commonTpl.loading);
  if (init) $page.html('');

  seeAjax('list', { ...filter, page }, res => {
    if (!res.success || !res.data || !res.data.length) {
      $list.html(commonTpl.noData);
      return;
    }

    $list.html(rowsTpl(res));

    if (init) {
      pagination = new Pagination('#page', {
        totalPages: res.totalPages,
        onChange: p => {
          requestList(p, !1);
          pagination.render();
        },
      });
      pagination.render();
    } else {
      $win.scrollTop($rowHead.offset().top);
    }
  });
};
