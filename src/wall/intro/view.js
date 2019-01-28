/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lib/jquery.seeView'], function($) {
  $.seeView({
    events: {
      // 点击显示推广弹出框
      '!click [data-show-promotion]': 'onClickShowPromotion',
      // 点击关闭推广框
      'click [data-promotion-close]': 'onClickPromotionClose',
    },
    // 点击显示推广弹出框
    onClickShowPromotion: function(e) {
      $('#promotion').show();
    },
    // 点击关闭推广框
    onClickPromotionClose: function(e) {
      $(e.target)
        .parents('.promotion')
        .hide();
    },
  });
});
