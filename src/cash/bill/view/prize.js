/**
 * Created by senntyou on 2017/3/29.
 */
define([
  'jquery',
  'toastr',
  'common/variables',
  'common/function',
  'util/dialog',
  '../data',
  '../util/confirm_bill',
  'lib/jquery.seeView',
], function($, toastr, commonVars, fn, dialog, data, confirmBill) {
  var $body = $('body');
  var $confirmDialog = $('#dialog-confirm');
  var $prizeDialog = $('#dialog-prize');
  var $licenceDialog = $('#dialog-licence');
  var $prizeAgree = $('#prize-agree');
  var $prizeInput = $('#prize-input');

  $.seeView({
    events: {
      // 点击同意按钮
      'click #prize-agree': 'onClickPrizeAgree',
      // 点击协议按钮
      'click #prize-licence': 'onClickPrizeLicence',
      // 点击确认
      'click #prize-ok': 'onClickPrizeOk',
      // 点击回到选择金额
      'click [data-to-select-money]': 'onClickToSelectMoney',
    },
    // 点击同意按钮
    onClickPrizeAgree: function(e) {
      $(e.currentTarget).toggleClass('active');
    },
    // 点击协议按钮
    onClickPrizeLicence: function(e) {
      $body.addClass('of-hidden');
      $licenceDialog.show();
    },
    // 点击确认
    onClickPrizeOk: function(e) {
      var $this = $(e.target);
      var active = $this.hasClass('active');

      if (!active) {
        data.currentDonateMoney = 0;
        confirmBill($this);
        return;
      }

      var agreed = $prizeAgree.hasClass('active');

      if (!agreed) {
        dialog('确认不同意打赏服务协议么？');
        return;
      }

      data.currentDonateMoney = parseFloat($prizeInput.val());

      var totalMoney = parseFloat(
        $($('[data-show-real-total-money]')[0]).text()
      ).toFixed(2);

      $('#confirm-real-take').text(
        (totalMoney - data.currentDonateMoney).toFixed(2)
      );
      $('#confirm-donate').text(data.currentDonateMoney);

      $prizeDialog.hide();
      $confirmDialog.show();
    },
    // 点击回到选择金额
    onClickToSelectMoney: function(e) {
      $prizeDialog.show();
      $confirmDialog.hide();
    },
  });
});
