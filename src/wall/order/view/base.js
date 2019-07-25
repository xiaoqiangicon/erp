/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lib/jquery.seeView'], function($) {
  $.seeView({
    events: {
      // 点击关闭弹窗
      'click [data-popup-close]': 'onClickPopupClose',
      // 点击模态框
      'click .modal': 'onClickModal',
    },
    // 点击关闭弹窗
    onClickPopupClose: function(e) {
      $(e.target)
        .parents('.modal')
        .hide();
      $('body').removeClass('overflow-hidden');
    },
    // 点击模态框
    onClickModal: function(e) {
      if (e.target === e.currentTarget) {
        $(e.target).hide();
        $('body').removeClass('overflow-hidden');
      }
    },
  });
});
