import $ from 'jquery';
import seeView from 'see-view';
// import seeAjax from 'see-ajax';
// import toastr from 'toastr';
// import { searchTpl } from './tpl';
import { checkSelect } from './util';
// import dialog from '../../util/dialog';

seeView({
  events: {
    // 切换 tab
    '!click [data-content-tab]': 'clickContentTab',
    // 选择所有的项目
    '!change #select-all-items': 'changeSelectAllItems',
    'change [data-items-row-select]': 'changeItemsRowSelect',
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
    const $items = $('[data-items-row-select]');

    if ($this.prop('checked')) $items.prop('checked', !0);
    else $items.prop('checked', !1);

    checkSelect();
  },
  changeItemsRowSelect() {
    checkSelect();
  },
});
