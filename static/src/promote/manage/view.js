import $ from 'jquery';
import seeView from 'see-view';
// import seeAjax from 'see-ajax';
// import toastr from 'toastr';
// import { searchTpl } from './tpl';
import { checkSelect, updateSet } from './util';
import share from './share';
// import dialog from '../../util/dialog';

let handlingIds = [];

seeView({
  events: {
    // 切换 tab
    '!click [data-content-tab]': 'clickContentTab',
    // 选择所有的项目
    '!change #select-all-items': 'changeSelectAllItems',
    'change [data-items-row-select]': 'changeItemsRowSelect',
    // 点击设置
    'click [data-items-row-set]': 'clickItemsRowSet'
  },
  // 切换 tab
  clickContentTab(e) {
    const $this = $(e.target);

    if ($this.hasClass('active')) return;

    const id = $this.attr('data-content-tab');

    $('[data-content]').hide();
    $(`[data-content="${id}"]`).show();
    $('[data-content-tab].active').removeClass('active');
    $(`[data-content-tab="${id}"]`).addClass('active');
  },
  // 选择所有的项目
  changeSelectAllItems(e) {
    const $this = $(e.target);
    const $items = $('[data-items-row-select]:not(:disabled)');

    if ($this.prop('checked')) $items.prop('checked', !0);
    else $items.prop('checked', !1);

    checkSelect();
  },
  changeItemsRowSelect() {
    checkSelect();
  },
  // 点击设置
  clickItemsRowSet(e) {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-items.row-set'), 10);

    const item = share.items.find(item => item.id === id);

    if (!item || item.noNeedPay) return;

    handlingIds = [id];
    updateSet(item.hasProfit && item.profitType, item.hasProfit && item.profit);
  }
});
