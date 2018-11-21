import $ from 'jquery';
import seeAjax from 'see-ajax';
// import Pagination from '@zzh/pagination';
import commonTpl from '../../common/tpl';
import { itemsTpl } from './tpl';
// import dialog from "../../util/dialog";
import { items } from './share';

export const scrollTop = () => {
  $(window).scrollTop(0);
};

const $itemsList = $('#list-1');

export const requestItems = () => {
  $itemsList.html(commonTpl.loading);
  seeAjax('items', {}, res => {
    if (!res.success || !res.data || !res.data.length) {
      $itemsList.html(commonTpl.noData);
      return;
    }

    res.data.forEach(item => {
      items[item.id] = item;
    });

    $itemsList.html(itemsTpl(res));
  });
};

const $selectAllItems = $('#select-all-items');
const $selectedCount = $('#selected-count');
const $batchSet = $('#batch-set');

export const checkSelect = () => {
  const allItemsCount = $('[data-items-row-select]').length;
  const selectedItemsCount = $('[data-items-row-select]:checked').length;

  $selectedCount.text(selectedItemsCount);
  $selectAllItems.prop('checked', allItemsCount === selectedItemsCount);

  if (selectedItemsCount) $batchSet.removeClass('dp-none');
  else $batchSet.addClass('dp-none');
};

// const $list = $('#list');
// const $page = $('#page');
//
// let pagination;
//
// export const filter = {
//   status: 1,
// };
//
// export const requestList = (page = 1, init = !0) => {
//   $list.html(commonTpl.loading);
//   if (init) $page.html('');
//
//   seeAjax('list', { ...filter, page }, res => {
//     if (!res.success || !res.data || !res.data.length) {
//       $list.html(commonTpl.noData);
//       return;
//     }
//
//     $list.html(rowsTpl(res));
//
//     if (init) {
//       pagination = new Pagination('#page', {
//         totalPages: res.totalPages,
//         onChange: p => {
//           requestList(p, !1);
//           pagination.render();
//         },
//       });
//       pagination.render();
//     }
//
//     scrollTop();
//   });
// };
