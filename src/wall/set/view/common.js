/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'toastr',
  'common/function',
  'common/variables',
  '../data',
  '../tpl',
  '../function',
  '../ajax',
  'lib/jquery.seeView',
], function($, toastr, commonFunc, commonVars, data, tpl, func) {
  $.seeView({
    events: {
      // 点击关闭弹窗
      'click [data-popup-close]': 'onClickPopupClose',
      // 点击取消
      '!click #action-cancel': 'onClickActionCancel',
      // 输入计数
      'keyup [data-words-count]': 'onKeyupWordsCount',
    },
    // 点击关闭弹窗
    onClickPopupClose: function(e) {
      $(e.target)
        .parents('.modal')
        .hide();
      $('body').removeClass('overflow-hidden');
    },
    // 点击取消
    onClickActionCancel: function(e) {
      commonFunc.confirm('你确定离开吗?（未保存的修改将不生效）', function() {
        history.back();
      });
    },
    // 输入计数
    onKeyupWordsCount: function(e) {
      var $this = $(e.target),
        id = $this.attr('data-words-count'),
        count = $this.val().length;

      $('[data-words-count-show="' + id + '"]').text(count);
    },
  });
});
