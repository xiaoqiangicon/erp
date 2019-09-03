import $ from 'jquery';
import toastr from 'toastr';
import commonVars from 'common/variables';
import fn from 'common/function';
import dialog from 'util/dialog';
import data from '../data';
import confirmBill from '../util/confirm_bill';
import seeView from 'see-view';
var $body = $('body');
var $confirmDialog = $('#dialog-confirm');
var $prizeDialog = $('#dialog-prize');
var $licenceDialog = $('#dialog-licence');
var $prizeAgree = $('#prize-agree');
var $prizeInput = $('#prize-input');
seeView({
  events: {
    'click #prize-agree': 'onClickPrizeAgree',
    'click #prize-licence': 'onClickPrizeLicence',
    'click #prize-ok': 'onClickPrizeOk',
    'click [data-to-select-money]': 'onClickToSelectMoney',
  },
  onClickPrizeAgree: function(e) {
    $(e.currentTarget).toggleClass('active');
  },
  onClickPrizeLicence: function(e) {
    $body.addClass('of-hidden');
    $licenceDialog.show();
  },
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
  onClickToSelectMoney: function(e) {
    $prizeDialog.show();
    $confirmDialog.hide();
  },
});
