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
var $dialogConfirm3 = $('#dialog-confirm-3');

// 2019-09 add
var $pre2 = $('#pre-2');
var $pre5 = $('#pre-5');
var $pre10 = $('#pre-10');
var $pre15 = $('#pre-15');
var $pre20 = $('#pre-20');
var $pre30 = $('#pre-30');

seeView({
  events: {
    'click #prize-agree': 'onClickPrizeAgree',
    'click #prize-licence': 'onClickPrizeLicence',
    'click #prize-ok': 'onClickPrizeOk',
    'click [data-to-select-money]': 'onClickToSelectMoney',
    // 2019-09
    'click [prize-selection]': 'onClickSelection',
    'click #prize-cancle-1': 'onClickCancle',
    'click #confirm-3-button': 'onClickOnDonate',
  },
  onClickPrizeAgree: function(e) {
    $(e.currentTarget).toggleClass('active');
  },
  onClickPrizeLicence: function(e) {
    $body.addClass('of-hidden');
    $licenceDialog.show();
  },
  onClickPrizeOk: function(e) {
    // 2019-09提现

    var $this = $(e.target);
    var active = $this.hasClass('active');

    // 没有active,没有打赏
    // if (!active) {
    //   data.currentDonateMoney = 0;

    //   // 转数据并发送请求
    //   confirmBill($this);
    //   return;
    // }

    // 打赏服务协议
    // var agreed = $prizeAgree.hasClass('active');
    // if (!agreed) {
    //   dialog('确认不同意打赏服务协议么？');
    //   return;
    // }

    // data.currentDonateMoney = parseFloat($prizeInput.val()); //选中的打赏金remove

    // 2019-09
    if (!data.currentDonateMoney) {
      data.currentDonateMoney = data.donateMoney5;
    }

    var totalMoney = parseFloat(
      $($('[data-show-real-total-money]')[0]).text()
    ).toFixed(2);

    // 减去打赏金
    $('#confirm-real-take').text(
      (totalMoney - data.currentDonateMoney).toFixed(2)
    );

    // 2019-09
    $('#confirm-to-cash-2').text(
      `￥${(totalMoney - data.currentDonateMoney).toFixed(2)}`
    );
    $('#confirm-to-zzh-2').text(`￥${data.currentDonateMoney}`);

    $('#confirm-donate').text(data.currentDonateMoney);
    $prizeDialog.hide();
    $confirmDialog.show();
  },
  onClickToSelectMoney: function(e) {
    $prizeDialog.show();
    $confirmDialog.hide();
  },

  // 2019-9
  onClickSelection: function(e) {
    var currentTarget = $(e.currentTarget);
    var has = currentTarget.hasClass('selection-active');
    if (!has) {
      currentTarget
        .siblings()
        .removeClass('selection-active')
        .end()
        .addClass('selection-active');
      var selection = currentTarget.attr('prize-selection');

      // 点击对应的数字将打赏金改成对应的值
      switch (selection) {
        case '2':
          data.currentDonateMoney = data.donateMoney2;
          break;
        case '5':
          data.currentDonateMoney = data.donateMoney5;
          break;

        case '10':
          data.currentDonateMoney = data.donateMoney10;
          break;

        case '15':
          data.currentDonateMoney = data.donateMoney15;
          break;

        case '20':
          data.currentDonateMoney = data.donateMoney20;
          break;

        case '30':
          data.currentDonateMoney = data.donateMoney30;
          break;

        default:
          data.currentDonateMoney = data.donateMoney5;
          break;
      }
    }
  },
  onClickCancle(e) {
    var totalMoney = parseFloat(
      $($('[data-show-real-total-money]')[0]).text()
    ).toFixed(2);
    console.log(totalMoney);
    $('#confirm-to-cash-3').text('￥' + totalMoney);

    $prizeDialog.hide();
    $dialogConfirm3.show();
  },
  onClickOnDonate(e) {
    var $this = $(e.target);
    console.log(data);
    confirmBill($this);

    $dialogConfirm3.hide();
  },
});
