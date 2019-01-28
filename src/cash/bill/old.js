/**
 * Created by senntyou on 2016/12/5.
 */
define([
  'jquery',
  'bootstrap-slider',
  'tippy',
  'common/variables',
  './func',
  './data',
  './tpl',
  './util/refresh_prize_btn',
  './bind',
  './view',
], function($, Slider, Tippy, commonVars, func, data, tpl, refreshPrizeBtn) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  // init
  (function() {
    var i,
      il,
      currentYear = commonVars.today.year,
      $selectYearContent1 = $('[data-select-year-content="1"]'),
      $selectYearContent2 = $('[data-select-year-content="2"]'),
      $statusContainer1 = $('[data-status-container="1"]'),
      $statusContainer2 = $('[data-status-container="2"]');

    // 填充空位, 2016为起始年份
    for (i = currentYear, il = 2016; i >= il; i--) {
      $selectYearContent1.append(
        tpl.selectYearItem.render({
          year: i,
          status: 1,
        })
      ),
        $selectYearContent2.append(
          tpl.selectYearItem.render({
            year: i,
            status: 2,
          })
        );
    }
    // 先不设置有疑问账单
    $.seeBind.setData('data-selected-year', currentYear, { status: 1 });
    $.seeBind.setData('data-selected-year', currentYear, { status: 2 });

    // 创建今天的数据容器
    $statusContainer1.append(
      tpl.yearContentContainer.render({
        year: currentYear,
        status: 1,
      })
    );
    $statusContainer2.append(
      tpl.yearContentContainer.render({
        year: currentYear,
        status: 2,
      })
    );

    // 今天的月数据
    func.requestBillData();

    // 获取账户信息
    $.seeAjax.get('accountInfo', {}, function(res) {
      if (res.success) {
        if (res.data && res.data.account) {
          $('#account-info-bank').text(res.data.bank);
          $('#account-info-sub-bank').text(res.data.subBank);
          $('#account-info-name').text(res.data.account);
          $('#account-info-card').text(res.data.bankCard);
          $('#account-info').show();
        }
      }
    });

    // 获取收据信息
    $.seeAjax.get('receiptsInfo', {}, function(res) {
      data.maxWaitingReceipts = res.maxWaitingReceipts;
      data.currentWaitingReceipts = res.currentWaitingReceipts;
      data.haveOrderInHandling = res.haveOrderInHandling;
      data.canTakeOrder = res.success;

      $('[data-max-waiting-receipts]').text(data.maxWaitingReceipts);
      $('[data-current-waiting-receipts]').text(data.currentWaitingReceipts);
      // 有订单正在处理中，或者超过设置的未寄收据数
      // 一些低版本的浏览器会不可点击，如果添加了 disabled class
      // if (!res.success || data.haveOrderInHandling) {
      //     $('[data-status-action="2"]').addClass('disabled');
      // }
    });

    // 统计数据
    $.seeAjax.get('stat', {}, function(res) {
      if (res.success) {
        data.stat = res.data;
      }
    });
  })();

  var $sliderInput = $('#prize-input');
  // 初始化 bootstrap-slider
  data.slider = new Slider('#slider', {
    min: 0,
    max: 1000,
    value: 0,
    step: 0.01,
    tooltip: 'hide',
    formatter: function(value) {
      $sliderInput.val(value);
      refreshPrizeBtn(value);
    },
  });

  // 需要保持高度一致的元素
  var sameHeightRecord = {};
  var $sameHeightEls = $('[data-same-height]');
  $sameHeightEls.map(function() {
    var $this = $(this);
    var height = $this.height();
    var key = $this.attr('data-same-height');

    if (!sameHeightRecord[key] || height > sameHeightRecord[key])
      sameHeightRecord[key] = height;
  });
  $sameHeightEls.map(function() {
    var $this = $(this);
    var key = $this.attr('data-same-height');
    var withLineHeight = $this.attr('data-with-line-height');

    $this.height(sameHeightRecord[key]);
    withLineHeight &&
      $this.css({ 'line-height': sameHeightRecord[key] + 'px' });
  });
});
