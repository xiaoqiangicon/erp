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
    if (!active) {
      data.currentDonateMoney = 0;

      // 转数据并发送请求
      confirmBill($this);
      return;
    }

    // 打赏服务协议
    var agreed = $prizeAgree.hasClass('active');
    if (!agreed) {
      dialog('确认不同意打赏服务协议么？');
      return;
    }
    data.currentDonateMoney = parseFloat($prizeInput.val()); //选中的打赏金
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

// 2019-09 add  -> resizeText

function resizeText(father, son) {
  var maxFontSize = 38,
    faH = father.height,
    soH = son.height;

  if (soH >= faH) {
    soH.css('font-size', parseInt());
  }
}
