import seeAjax from 'see-ajax';
import $ from 'jquery';
import commonUpload from 'common/upload';
import data from './data';
import tpl from './tpl';
import func from './func';
import './view';
import './orchids';
import 'lib/bootstrap-material-datetimepicker';
$.ajaxSetup({
  cache: !1,
});
$('[data-select-date]').bootstrapMaterialDatePicker({
  time: false,
  lang: 'zh-cn',
  cancelText: '取消',
  okText: '确定',
  clearText: '清除',
  nowText: '现在',
  clearButton: true,
});
seeAjax('accountInfo', {}, function(res) {
  if (res.success) {
    data.accountData = res.data;
    if (res.data && res.data.account) {
      $('#account-name').text(res.data.account);
      $('#account-number').text(res.data.bankCard);
      $('#tip-section-info').show();
    }
    if (data.accountStatus === 2 && res.data.reason) {
      $('#dialog-account-no-reason-content').text(res.data.reason);
      $('#dialog-account-no-reason').removeClass('hide');
    }
    if (res.pickUpSpecialCnt !== 'undefined') {
      let surplus = 2 - res.pickUpSpecialCnt < 0 ? 0 : 2 - res.pickUpSpecialCnt;
      $('#special-cash-surplus').text(surplus);
      $('#special-cash-used').text(res.pickUpSpecialCnt);
    }
  }
});
var $receiptsContent = $('#dialog-receipts-content');
commonUpload('#dialog-receipts-add-input', function(url) {
  $receiptsContent.append(
    tpl.popupReceiptsRow.render({
      src: url,
    })
  );
});
func.init();
