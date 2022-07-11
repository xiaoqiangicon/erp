import $ from 'jquery';
import seeAjax from 'see-ajax';
import Pagination from '../../com-deprecated/pagination';
import commonTpl from '../../common/tpl';
import { itemsTpl, recordsTpl } from './tpl';
import share from './share';

const $win = $(window);

const $itemsList = $('#list-1');
const $selectAllItems = $('#select-all-items');

const renderInfo = res => {
  const { title, statusText, addTime, ended, online, canOnline } = res;
  $('#display-title').text(title);
  $('#display-status').text(statusText);
  $('#display-add-time').text(addTime);

  const $content1 = $('[data-content="1"]');

  // -1 未开始 0 进行中 1 已结束
  if (ended > 0) $content1.addClass('no-select');

  $('#summary').show();
  $content1.show();

  // 这个数据需要每次刷新
  const $online = $('#online');

  // 如果佛事以下架，则不能上架
  if (res.ended === 1 || !canOnline) {
    $online.removeClass('active');
    $online.addClass('disabled');
  } else if (online) {
    $online.removeClass('disabled');
    $online.addClass('active');
  } else {
    $online.removeClass('disabled');
    $online.removeClass('active');
  }
};

export const requestItems = () => {
  $selectAllItems.prop('checked', !1);
  $itemsList.html(commonTpl.loading);
  seeAjax('items', {}, res => {
    if (!res.success || !res.data || !res.data.length) {
      $itemsList.html(commonTpl.noData);
      return;
    }

    share.canOnline = res.canOnline;
    share.ended = res.ended;

    renderInfo(res);

    share.items = res.data;

    $itemsList.html(itemsTpl(res));
  });
};

const $selectedCount = $('#selected-count');
const $batchSet = $('#batch-set');

export const checkSelect = () => {
  const allItemsCount = $('[data-items-row-select]:not(:disabled)').length;
  const selectedItemsCount = $('[data-items-row-select]:checked').length;

  $selectedCount.text(selectedItemsCount);
  $selectAllItems.prop('checked', allItemsCount === selectedItemsCount);

  if (selectedItemsCount) $batchSet.removeClass('dp-none');
  else $batchSet.addClass('dp-none');
};

const $set = $('#set');
const $setOverlay = $('#set-overlay');
const $setTitle = $('#set-title');
const $setNav = $('#set-nav');
const $setNavItems = $('[data-set-nav]');
const $setInput = $('#set-input');
const $setMark = $('#set-mark');
const $setOk = $('#set-ok');
const $setHint = $('#set-hint');

/**
 * 更新 set 弹框的 ui
 *
 * @param rewardType 类型，默认 1
 * @param reward 金额或比例
 * @param fixedRewardType 固定为比例或金额
 */
export const updateSet = (rewardType, reward, fixedRewardType) => {
  if (fixedRewardType) {
    $set.attr({ 'data-fixed-reward-type': fixedRewardType });
    $setTitle.text(fixedRewardType === 1 ? '分成比例' : '分成金额');
    $setMark.text(fixedRewardType === 1 ? '%' : '元');
    $setTitle.show();
    $setNav.hide();
  } else {
    $set.attr({ 'data-fixed-reward-type': 0 });
    $setNavItems.removeClass('active');
    $(`[data-set-nav="${rewardType || 1}"]`).addClass('active');
    $setMark.text(rewardType === 2 ? '元' : '%');
    $setTitle.hide();
    $setNav.show();
  }
  $setInput.val(reward || '');
  $setOk[reward ? 'removeClass' : 'addClass']('disabled');
  $setHint.hide();

  $set.show();
  $setOverlay.show();
};

export const checkSet = () => {
  const value = $setInput.val();

  if (!value) {
    $setHint.hide();
    $setOk.addClass('disabled');
    return;
  }

  const floatValue = parseFloat(value);

  if (Number.isNaN(floatValue)) {
    $setHint.text(`输入 ${value} 格式不合法，请正确输入数字`).show();
    $setOk.addClass('disabled');
    return;
  }

  const fixedRewardType = parseInt($set.attr('data-fixed-reward-type'), 10);
  const rewardType = parseInt(
    $('[data-set-nav].active').attr('data-set-nav'),
    10
  );
  const usePercent = fixedRewardType ? fixedRewardType === 1 : rewardType === 1;
  let errorText;

  // 比例
  if (usePercent) {
    share.handlingIds.forEach(id => {
      if (errorText) return;

      const item = share.items.find(i => i.id === id);
      const {
        priceType,
        price,
        hasCharge,
        chargeType,
        charge,
        hasPromote,
        promoteType,
        promote,
      } = item;
      let max = 100;

      // 有服务费
      if (hasCharge) {
        // 比例
        if (chargeType === 1) {
          max -= charge;
        }
        // 金额
        else if (priceType === 1) {
          max -= Math.ceil(charge / price);
        }
        // 随喜，且按固定金额付服务费
        else {
          errorText = `随喜不能按固定金额付服务费，请联系自在家工作人员（id: ${id}）`;
          return;
        }
      }

      // 有推广费
      if (hasPromote) {
        // 比例
        if (promoteType === 1) {
          max -= promote;
        }
        // 金额
        else if (priceType === 1) {
          max -= Math.ceil(promote / price);
        }
        // 随喜，且按固定金额付推广费
        else {
          errorText = `随喜不能按固定金额付推广费，请联系自在家工作人员（id: ${id}）`;
          return;
        }
      }

      if (floatValue > max) {
        if (hasPromote)
          errorText = `当前项目正在平台合作，分成比例不可超过<span class="special-11">${max}%</span>`;
        else
          errorText = `分成比例不可超过<span class="special-11">${max}%</span>`;
      }
    });
  }
  // 金额
  else {
    share.handlingIds.forEach(id => {
      if (errorText) return;

      const item = share.items.find(i => i.id === id);
      const {
        priceType,
        price,
        hasCharge,
        chargeType,
        charge,
        hasPromote,
        promoteType,
        promote,
      } = item;

      if (priceType === 3) {
        errorText = '随喜不能按固定金额提成';
        return;
      }

      let max = price;

      // 有服务费
      if (hasCharge) {
        // 比例
        if (chargeType === 1) {
          max -= (charge * price) / 100;
        }
        // 金额
        else {
          max -= charge;
        }
      }

      // 有推广费
      if (hasPromote) {
        // 比例
        if (promoteType === 1) {
          max -= (promote * price) / 100;
        }
        // 金额
        else {
          max -= promote;
        }
      }

      if (floatValue > max) {
        if (hasPromote)
          errorText = `当前项目正在平台合作，分成金额不可超过<span class="special-11">${max}元</span>`;
        else
          errorText = `分成金额不可超过<span class="special-11">${max}元</span>`;
      }
    });
  }

  if (errorText) {
    $setHint.html(errorText).show();
    $setOk.addClass('disabled');
    return;
  }

  $setHint.hide();
  $setOk.removeClass('disabled');
};

const $list = $('#list-2');
const $page = $('#page-2');
const $rowHead = $('#row-head-2');

let pagination;

export const filter = {
  status: 0,
  search: '',
  time: '',
};

export const requestRecords = (page = 1, init = !0) => {
  $list.html(commonTpl.loading);
  if (init) $page.html('');

  seeAjax('records', { ...filter, page }, res => {
    if (!res.success || !res.data || !res.data.length) {
      $list.html(commonTpl.noData);
      return;
    }

    $list.html(recordsTpl(res));

    if (init) {
      pagination = new Pagination('#page-2', {
        totalPages: res.totalPages,
        onChange: p => {
          requestRecords(p, !1);
          pagination.render();
        },
      });
      pagination.render();
    } else {
      $win.scrollTop($rowHead.offset().top);
    }
  });
};
