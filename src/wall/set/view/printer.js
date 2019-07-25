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
      // 点击选项
      '!change #printer-popup-pages': 'onChangePrinterPages',
      // 切换打印类型
      '!change [name="printer-popup-print-type"]': 'onChangePrintType',
    },
    // 点击选项
    onChangePrinterPages: function(e) {
      var $this = $('#printer-popup-pages');
      var pages = parseInt($this.val());
      var printType = parseInt(
        $('[name="printer-popup-print-type"]:checked').val()
      );

      // 隔联打印至少需要两联及以上
      if (pages == 1 && printType == 2) {
        toastr.warning('隔联打印至少需要两联');
        $this.val(data.currentPrinterPages);
      } else {
        data.currentPrinterPages = pages;
      }
    },
    // 切换打印类型
    onChangePrintType: function(e) {
      var pages = parseInt($('#printer-popup-pages').val());
      var printType = parseInt(
        $('[name="printer-popup-print-type"]:checked').val()
      );

      // 隔联打印至少需要两联及以上
      if (pages == 1 && printType == 2) {
        toastr.warning('隔联打印至少需要两联');
        $('[name="printer-popup-print-type"][value="1"]').prop({ checked: !0 });
      }
    },
  });
});
