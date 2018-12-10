
const $ = require('jquery');
const seeAjax = require('see-ajax');
require('@zzh/pagination/dist/pagination.css');
require('less/pagination.less');
const Pagination = require('@zzh/pagination');

let commonTpl = require('common/tpl');

let data = require('../data');
let scrollTop = require('./scroll_top');
let rowsTpl = require('../tpl/main/rows');
require('../ajax');

/**
 * 请求列表信息
 *
 * @param page
 * @param init 是否是初始化分页
 */
let requestList = (page, init) => {
    !page && (page = 1);
    typeof init === 'undefined' && (init = !0);

    data.search.page = page;

    let $listContainer = $('#list-container');
    let $paginationContainer = $('#pagination-container');
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
                }
            });
            data.pagination.render();
        }

        scrollTop();
    });
};

module.exports = requestList;