define(['jquery', '../data'], function($, data) {
  var $prizeDialog = $('#dialog-prize');
  var $prizeSum = $('#prize-sum');
  var $prizeOk = $('#prize-ok');
  var $prizeInput = $('#prize-input');
  var $prizeAgree = $('#prize-agree');

  return function() {
    var totalMoney = parseFloat(
      $($('[data-show-real-total-money]')[0]).text()
    ).toFixed(2);
    // $prizeSum.text(totalMoney);
    $prizeSum.text(data.stat.total);
    $prizeOk.removeClass('active');
    $prizeAgree.addClass('active');
    $prizeInput.val(0);
    data.slider.setValue(0);
    data.slider.setAttribute('max', totalMoney);

    $prizeDialog.show();
  };
});
