import $ from 'jquery';
import seeAjax from 'see-ajax';
import seeView from 'see-view';
import toastr from 'toastr';
import { checkSelect, checkSet, requestItems, updateSet } from './util';
import share from './share';
import dialog from '../../util/dialog';

seeView({
  events: {
    // 切换 tab
    '!click [data-content-tab]': 'clickContentTab',
    // 选择所有的项目
    '!change #select-all-items': 'changeSelectAllItems',
    'change [data-items-row-select]': 'changeItemsRowSelect',
    '!click #set-overlay': 'clickSetOverlay',
    // 点击设置
    'click [data-items-row-set]': 'clickItemsRowSet',
    '!click [data-set-nav]': 'clickSetNav',
    // 输入框改变
    '!input #set-input': 'changeSetInput',
    '!propertychange #set-input': 'changeSetInput',
    // 确认 ok
    '!click #set-ok': 'clickSetOk',
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
  clickSetOverlay() {
    $('#set').hide();
    $('#set-overlay').hide();
  },
  // 点击设置
  clickItemsRowSet(e) {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-items-row-set'), 10);

    const item = share.items.find(i => i.id === id);

    if (!item || item.noNeedPay) return;

    share.handlingIds = [id];
    updateSet(item.hasProfit && item.profitType, item.hasProfit && item.profit, item.priceType === 3 ? 1 : undefined);

    checkSet();
  },
  clickSetNav(e) {
    const $this = $(e.target);
    const type = parseInt($this.attr('data-set-nav'), 10);

    if ($this.hasClass('active')) return;

    $('[data-set-nav].active').removeClass('active');
    $(`[data-set-nav="${type}"]`).addClass('active');

    $('#set-mark').text(type === 1 ? '%' : '元');

    checkSet();
  },
  // 输入框改变
  changeSetInput() {
    checkSet();
  },
  // 确认 ok
  clickSetOk(e) {
    const $this = $(e.target);

    if ($this.hasClass('disabled')) return;

    if (parseInt($this.attr('data-handling'), 10)) return;

    const $set = $('#set');
    const value = parseFloat($('#set-input').val());
    const fixedProfitType = parseInt($set.attr('data-fixed-profit-type'), 10);
    const profitType = parseInt($('[data-set-nav].active').attr('data-set-nav'), 10);

    $this.attr('data-handling', 1);

    seeAjax(
      'update',
      {
        ids: share.handlingIds.join(','),
        profit: value,
        profitType: fixedProfitType || profitType,
      },
      res => {
        $this.attr('data-handling', 0);

        if (!res.success) {
          dialog(res.message);
          return;
        }

        toastr.success('保存成功');
        $set.hide();
        $('#set-overlay').hide();
        requestItems();
      }
    );
  },
});
