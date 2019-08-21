import seeAjax from 'see-ajax';
import $ from 'jquery';
import Slider from 'bootstrap-slider';
import Tippy from 'tippy';
import commonVars from 'common/variables';
import func from './func';
import data from './data';
import tpl from './tpl';
import refreshPrizeBtn from './util/refresh_prize_btn';
import './bind';
import './view';
$.ajaxSetup({
  cache: !1,
});
(function() {
  var i,
    il,
    currentYear = commonVars.today.year,
    $selectYearContent1 = $('[data-select-year-content="1"]'),
    $selectYearContent2 = $('[data-select-year-content="2"]'),
    $statusContainer1 = $('[data-status-container="1"]'),
    $statusContainer2 = $('[data-status-container="2"]');
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
  $.seeBind.setData('data-selected-year', currentYear, {
    status: 1,
  });
  $.seeBind.setData('data-selected-year', currentYear, {
    status: 2,
  });
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
  func.requestBillData();
  seeAjax('accountInfo', {}, function(res) {
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
  seeAjax('receiptsInfo', {}, function(res) {
    data.maxWaitingReceipts = res.maxWaitingReceipts;
    data.currentWaitingReceipts = res.currentWaitingReceipts;
    data.haveOrderInHandling = res.haveOrderInHandling;
    data.canTakeOrder = res.success;
    $('[data-max-waiting-receipts]').text(data.maxWaitingReceipts);
    $('[data-current-waiting-receipts]').text(data.currentWaitingReceipts);
  });
  seeAjax('stat', {}, function(res) {
    if (res.success) {
      data.stat = res.data;
    }
  });
})();
var $sliderInput = $('#prize-input');
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
    $this.css({
      'line-height': sameHeightRecord[key] + 'px',
    });
});
