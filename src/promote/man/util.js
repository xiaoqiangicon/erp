import $ from 'jquery';
import seeAjax from 'see-ajax';
import Pagination from '../../../old-com/pagination/src';
import commonTpl from '../../common/tpl';
import { rowsTpl } from './tpl';

const $win = $(window);

const renderInfo = res => {
  $('#nickname').text(res.nickname);
  $('#name').text(res.name);
  $('#avatar').attr({ src: res.avatar });
  $('#phone').text(res.phone);
  $('#pending-income').text(res.pendingIncome);
  $('#got-income').text(res.gotIncome);
  $('#total-income').text(res.totalIncome);
  $('#promote-count').text(res.promoteCount);
  $('#intro').show();
};

const $list = $('#list');
const $page = $('#page');
const $rowHead = $('#row-head');

let pagination;

export const filter = {
  status: -1,
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

    renderInfo(res);

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
