/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'underscore',
  'toastr',
  'common/function',
  'common/variables',
  '../data',
  '../tpl',
  '../function',
  './util',
  '../ajax',
  'lib/jquery.seeView',
], function($, _, toastr, commonFunc, commonVars, data, tpl, func, util) {
  $.seeView({
    events: {
      // 选择了某个大殿
      '!change #select-house': 'onChangeSelectHouse',
      // 选择了某个区域
      '!change #select-region': 'onChangeSelectRegion',
      // 点击录入数据
      '!click #action-record': 'onClickActionRecord',
      // 点击关闭弹窗
      'click [data-popup-close]': 'onClickPopupClose',
    },
    // 选择了某个大殿
    onChangeSelectHouse: function(e) {
      var value = $(e.target).val();
      var $selectRegion = $('#select-region');

      $selectRegion.find('option').map(function() {
        var $this = $(this),
          name = $this.attr('data-name'),
          id = parseInt($this.val());

        // id = 0，是未选择项
        if (!id) return;

        if (!value) {
          $this.addClass('hide');
          return;
        }
        if (name.indexOf(value) === 0) $this.removeClass('hide');
        else $this.addClass('hide');
      });

      // 触发一次未选择
      $selectRegion.val(0);
      this.onChangeSelectRegion();
    },
    // 选择了某个区域
    onChangeSelectRegion: function(e) {
      var $this = $('#select-region'),
        id = parseInt($this.val()),
        $actionRecord = $('#action-record');

      // 为选择任何一个区域
      if (!id) {
        $('#content-body').html('');
        $actionRecord.addClass('hide');
      } else {
        func.requestRegion(id);
        $actionRecord.removeClass('hide');
      }

      data.currentRegionId = id;

      util.resetHoverPopup();
      util.hideHoverPopup();
    },
    // 点击录入数据
    onClickActionRecord: function(e) {
      util.fillCreatePopup();
      util.showCreatePopup();
    },
    // 点击关闭弹窗
    onClickPopupClose: function(e) {
      $(e.target)
        .parents('.modal')
        .hide();
      $('body').removeClass('overflow-hidden');
    },
  });
});
