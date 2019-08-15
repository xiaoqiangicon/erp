import $ from 'jquery';
import seeAjax from 'see-ajax';
import '../../../../../old-com/pagination/src/index.less';
import 'less/pagination.less';
import Pagination from '../../../../../old-com/pagination/src';
import commonTpl from 'common/tpl';
import data from '../data';
import scrollTop from './scroll_top';
import rowsTpl from '../tpl/main/rows';
import '../ajax';
const requestList = (page, init) => {
  !page && (page = 1);
  typeof init === 'undefined' && (init = !0);
  const $listContainer = $('#list-container');
  const $paginationContainer = $('#pagination-container');
  $listContainer.html(commonTpl.loading);
  init && $paginationContainer.html('');
  seeAjax(
    'list',
    {
      page,
    },
    res => {
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
      $('.publish-schedule').click(() => {
        $('.publish-mask').show();
      });
    }
  );
};
export default requestList;
