const $ = require('jquery');
const seeAjax = require('see-ajax');
require('../../../../../old-com/pagination/src/index.less');
require('less/pagination.less');
const Pagination = require('../../../../../old-com/pagination/src');

const commonTpl = require('common/tpl');

const data = require('../data');
const scrollTop = require('./scroll_top');
const rowsTpl = require('../tpl/main/rows');
require('../ajax');

/**
 * 请求列表信息
 *
 * @param page
 * @param init 是否是初始化分页
 */
const requestList = (page, init) => {
  !page && (page = 1);
  typeof init === 'undefined' && (init = !0);

  data.search.page = page;

  const $listContainer = $('#list-container');
  const $paginationContainer = $('#pagination-container');
  $listContainer.html(commonTpl.loading);
  init && $paginationContainer.html('');

  seeAjax('list', data.search, res => {
    if (!res.success || !res.data || !res.data.length) {
      $listContainer.html(commonTpl.noData);
      return;
    }

    $listContainer.html(rowsTpl(res));

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

    scrollTop();
  });
};

module.exports = requestList;
