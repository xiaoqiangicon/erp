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
      // 点击取消编辑单元格
      '!click #hover-popup-no': 'onClickHoverPopupNo',
      // 点击确定编辑单元格
      '!click #hover-popup-ok': 'onClickHoverPopupOk',
    },
    // 点击取消编辑单元格
    onClickHoverPopupNo: function(e) {
      util.resetHoverPopup();
      util.hideHoverPopup();
    },
    // 点击确定编辑单元格
    onClickHoverPopupOk: function(e) {
      util.fillCreatePopup();
      util.showCreatePopup();
    },
  });
});
