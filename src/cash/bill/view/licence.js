/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'lib/jquery.seeView'], function($) {
  var $body = $('body');
  var $prizeAgree = $('#prize-agree');

  $.seeView({
    events: {
      // 点击同意按钮
      'click #licence-ok': 'onClickLicenceOk',
    },
    // 点击同意按钮
    onClickLicenceOk: function(e) {
      // 确保是处于 active 状态
      $prizeAgree.addClass('active');

      $(e.target)
        .parents('.dialog')
        .hide();
      $body.removeClass('of-hidden');
    },
  });
});
