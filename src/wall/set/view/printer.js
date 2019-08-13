import $ from 'jquery';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
import tpl from '../tpl';
import func from '../function';
import '../ajax';
import 'lib/jquery.seeView';
$.seeView({
  events: {
    '!change #printer-popup-pages': 'onChangePrinterPages',
    '!change [name="printer-popup-print-type"]': 'onChangePrintType',
  },
  onChangePrinterPages: function(e) {
    var $this = $('#printer-popup-pages');
    var pages = parseInt($this.val());
    var printType = parseInt(
      $('[name="printer-popup-print-type"]:checked').val()
    );
    if (pages == 1 && printType == 2) {
      toastr.warning('隔联打印至少需要两联');
      $this.val(data.currentPrinterPages);
    } else {
      data.currentPrinterPages = pages;
    }
  },
  onChangePrintType: function(e) {
    var pages = parseInt($('#printer-popup-pages').val());
    var printType = parseInt(
      $('[name="printer-popup-print-type"]:checked').val()
    );
    if (pages == 1 && printType == 2) {
      toastr.warning('隔联打印至少需要两联');
      $('[name="printer-popup-print-type"][value="1"]').prop({
        checked: !0,
      });
    }
  },
});
