import $ from 'jquery';
import seeAjax from 'see-ajax';
import Pagination from '@zzh/pagination';
import commonTpl from '../../common/tpl';
import { rowsTpl } from './tpl';
import share from './share';

const $win = $(window);

const $list = $('#list');
const $page = $('#page');
const $rowHead = $('#row-head');

let pagination;

export const filter = {
  status: 1,
};

export const requestList = (page = 1, init = !0) => {
  $list.html(commonTpl.loading);
  if (init) $page.html('');

  seeAjax('list', { ...filter, page }, res => {
    if (!res.success || !res.data || !res.data.length) {
      $list.html(commonTpl.noData);
      return;
    }

    share.items = res.data;

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
