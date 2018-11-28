import $ from 'jquery';
import seeAjax from 'see-ajax';
import Pagination from '@zzh/pagination';
import commonTpl from '../../common/tpl';
import { verifyRowsTpl, manRowsTpl } from './tpl';
import share from './share';

const $win = $(window);

// 待审核
const $pendingCount = $('#pending-count');

const renderInfo = existedData => {
  const { pendingCount, hasPromoteUrl } = existedData;

  if (pendingCount) $pendingCount.text(pendingCount).removeClass('dp-none');
  else $pendingCount.text(0).addClass('dp-none');

  share.hasPromoteUrl = hasPromoteUrl;
};

const $verifyList = $('#list-1');
const $verifyPage = $('#page-1');
const $verifyRowHead = $('#verify-row-head');

let verifyPagination;

export const verifyFilter = {
  status: 0,
  countSort: 0,
  amountSort: 0,
};

export const requestVerifyList = (page = 1, init = !0) => {
  $verifyList.html(commonTpl.loading);
  if (init) $verifyPage.html('');

  seeAjax('verify-list', { ...verifyFilter, page }, res => {
    if (!res.success || !res.data || !res.data.length) {
      $verifyList.html(commonTpl.noData);
      return;
    }

    share.verifyList = res.data;

    renderInfo({ pendingCount: res.pendingCount, hasPromoteUrl: res.hasPromoteUrl });

    $verifyList.html(verifyRowsTpl(res));

    if (init) {
      verifyPagination = new Pagination('#page-1', {
        totalPages: res.totalPages,
        onChange: p => {
          requestVerifyList(p, !1);
          verifyPagination.render();
        },
      });
      verifyPagination.render();
    } else {
      $win.scrollTop($verifyRowHead.offset().top);
    }
  });
};

const $manList = $('#list-2');
const $manPage = $('#page-2');
const $manRowHead = $('#man-row-head');

let manPagination;

export const manFilter = {
  status: 0,
  countSort: 0,
  amountSort: 0,
  totalAmountSort: 0,
  timeSort: 0,
  search: '',
};

export const requestManList = (page = 1, init = !0) => {
  $manList.html(commonTpl.loading);
  if (init) $manPage.html('');

  seeAjax('man-list', { ...manFilter, page }, res => {
    if (!res.success || !res.data || !res.data.length) {
      $manList.html(commonTpl.noData);
      return;
    }

    share.manList = res.data;

    $manList.html(manRowsTpl(res));

    if (init) {
      manPagination = new Pagination('#page-2', {
        totalPages: res.totalPages,
        onChange: p => {
          requestManList(p, !1);
          manPagination.render();
        },
      });
      manPagination.render();
    } else {
      $win.scrollTop($manRowHead.offset().top);
    }
  });
};
