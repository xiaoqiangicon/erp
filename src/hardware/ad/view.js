/**
 * Created by senntyou on 2017/7/18.
 */

define([
  'jquery',
  'toastr',
  'common/function',
  './data',
  './tpl',
  './function',
  'lib/jquery.seeView',
], function($, toastr, commonFunc, data, tpl, func) {
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 2000;

  $.seeView({
    events: {
      // 点击切换显示隐藏
      'click [data-row-switch]': 'onClickRowSwitch',
    },
    // 点击切换显示隐藏
    onClickRowSwitch: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-row-switch')),
        hide = parseInt($this.attr('data-hide')) || 0,
        targetHide = 1 - hide;

      $.seeAjax.post('switch', { id: id, hide: targetHide }, function(res) {
        if (res.success) {
          $this
            .attr({ 'data-hide': targetHide })
            .text(['隐藏', '显示'][targetHide]);
          var $row = $('[data-row="' + id + '"]');
          var $hide = $('[data-row-hide="' + id + '"]');
          $hide.text(['显示', '隐藏'][targetHide]);
          if (targetHide) {
            $row.addClass('hided');
            $this.addClass('btn-show').removeClass('btn-hide');
          } else {
            $row.removeClass('hided');
            $this.removeClass('btn-show').addClass('btn-hide');
          }
          toastr.success('切换状态成功');
        } else {
          toastr.error('切换状态失败，请稍后再试');
        }
      });
    },
  });
});
