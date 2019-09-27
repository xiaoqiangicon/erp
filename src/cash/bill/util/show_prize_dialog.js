import $ from 'jquery';
import data from '../data';
var $prizeDialog = $('#dialog-prize');
var $prizeSum = $('#prize-sum');
var $prizeOk = $('#prize-ok');
var $prizeInput = $('#prize-input');
var $prizeAgree = $('#prize-agree');
export default function() {
  var totalMoney = parseFloat(
    $($('[data-show-real-total-money]')[0]).text()
  ).toFixed(2);
  $prizeSum.text(data.stat.total);
  $prizeOk.removeClass('active');
  $prizeAgree.addClass('active');
  $prizeInput.val(0);
  // data.slider.setValue(0);
  // data.slider.setAttribute('max', totalMoney);//2019-09remove
  $prizeDialog.show();
}
