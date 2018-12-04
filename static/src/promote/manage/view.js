import $ from 'jquery';
import seeAjax from 'see-ajax';
import seeView from 'see-view';
import toastr from 'toastr';
import { checkSelect, checkSet, filter, requestItems, requestRecords, updateSet } from './util';
import share from './share';
import dialog from '../../util/dialog';
import alert from '../../util/alert';

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
    // 批量设置
    '!click #batch-set': 'clickBatchSet',
    '!click [data-filter-status]': 'clickFilterStatus',
    '!keyup #filter-search': 'keyUpFilterSearch',
    '!click #filter-search-ok': 'clickFilterSearchOk',
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
    updateSet(item.hasReward && item.rewardType, item.hasReward && item.reward, item.priceType === 3 ? 1 : undefined);

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
    const fixedRewardType = parseInt($set.attr('data-fixed-reward-type'), 10);
    const rewardType = parseInt($('[data-set-nav].active').attr('data-set-nav'), 10);

    $this.attr('data-handling', 1);

    const foShiIds = [];
    const xuanZeIds = [];

    share.handlingIds.forEach(id => {
      const item = share.items.find(i => i.id === id);

      if (item.isXuanZe) xuanZeIds.push(id);
      else foShiIds.push(id);
    });

    seeAjax(
      'update',
      {
        foShiIds: foShiIds.join(','),
        xuanZeIds: xuanZeIds.join(','),
        reward: value,
        rewardType: fixedRewardType || rewardType,
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
  // 批量设置
  clickBatchSet() {
    const ids = [];

    /* eslint-disable array-callback-return */
    $('[data-items-row-select]:not(:disabled):checked').map(function() {
      ids.push(parseInt($(this).attr('data-items-row-select'), 10));
    });

    if (!ids.length) return;

    const suiXiItem = share.items.find(i => i.priceType === 3 && ids.indexOf(i.id) > -1);

    share.handlingIds = ids;

    if (suiXiItem) {
      alert('您的选择中含有随喜的项目，只能批量更新分成比例', () => {
        updateSet(undefined, undefined, 1);
      });
    } else {
      updateSet();
    }
  },
  clickFilterStatus(e) {
    const $this = $(e.target);

    filter.status = parseInt($this.attr('data-filter-status'), 10);
    $('#filter-status').text($this.text());

    requestRecords();
  },
  keyUpFilterSearch(e) {
    if (e.keyCode === 13) this.clickFilterSearchOk();
  },
  clickFilterSearchOk() {
    filter.search = $('#filter-search').val();

    requestRecords();
  },
});
