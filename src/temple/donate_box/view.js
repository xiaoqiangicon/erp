import $ from 'jquery';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import func from './function';
import Clipboard from 'clipboard';
import '../../../pro-com/src/libs-es5/jquery-qrcode';
import './ajax';
import seeView from 'see-view';
seeView({
  events: {
    'click #filter-submit': 'onClickFilterSubmit',
    'click #promotion': 'onClickPromotion',
    'click [data-popup]': 'onClickPopup',
    'click [data-switch-qrcode]': 'onClickSwitchQrcode',
    'click #export': 'onClickExport',
  },
  onClickFilterSubmit: function(e) {
    var $startDate = $('#filter-start-date'),
      startDate = $startDate.val(),
      startDateInt =
        !!startDate &&
        parseInt(
          startDate.slice(0, 4) + startDate.slice(5, 7) + startDate.slice(8, 10)
        ),
      $endDate = $('#filter-end-date'),
      endDate = $endDate.val(),
      endDateInt =
        !!endDate &&
        parseInt(
          endDate.slice(0, 4) + endDate.slice(5, 7) + endDate.slice(8, 10)
        );
    if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
      $.alert({
        title: false,
        content: '您选择的起始时间大于了结束时间，请重新选择',
        buttons: {
          ok: {
            text: '确定',
          },
        },
        theme: 'white',
      });
      return;
    }
    data.filter.startDate = startDate;
    data.filter.endDate = endDate;
    func.requestList();
  },
  onClickPromotion: function(e) {
    var $promotionPopup = $('#promotion-popup');
    if (!$promotionPopup.length) {
      $promotionPopup = $(
        tpl.promotionPopup.render({
          link: data.shareLink,
        })
      );
      $('body').append($promotionPopup);
      new Clipboard('[data-clipboard-target]');
      $('#website-url-qrcode-container').qrcode({
        width: data.qrcodeSizes[0],
        height: data.qrcodeSizes[0],
        text: data.shareLink,
      });
    } else {
      $promotionPopup.show();
    }
  },
  onClickPopup: function(e) {
    var $this = $(e.target),
      close =
        !!$this.attr('data-popup-close') || !!$this.attr('data-popup-overlay');
    if (close) {
      $(e.currentTarget).hide();
    }
  },
  onClickSwitchQrcode: function(e) {
    var $this = $(e.target),
      type = parseInt($this.attr('data-type'));
    if ($this.hasClass('active')) return;
    $('[data-switch-qrcode].active').removeClass('active');
    $this.addClass('active');
    $('#website-url-qrcode-container').html('');
    $('#website-url-qrcode-container').qrcode({
      width: data.qrcodeSizes[type - 1],
      height: data.qrcodeSizes[type - 1],
      text: data.shareLink,
    });
  },
  onClickExport: function(e) {
    var $startDate = $('#filter-start-date'),
      startDate = $startDate.val(),
      startDateInt =
        !!startDate &&
        parseInt(
          startDate.slice(0, 4) + startDate.slice(5, 7) + startDate.slice(8, 10)
        ),
      $endDate = $('#filter-end-date'),
      endDate = $endDate.val(),
      endDateInt =
        !!endDate &&
        parseInt(
          endDate.slice(0, 4) + endDate.slice(5, 7) + endDate.slice(8, 10)
        );
    if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
      $.alert({
        title: false,
        content: '您选择的起始时间大于了结束时间，请重新选择',
        buttons: {
          ok: {
            text: '确定',
          },
        },
        theme: 'white',
      });
      return;
    }
    window.open(
      '/zzhadmin/meritBoxDownloadExcel/?startTime=' +
        startDate +
        '&endTime=' +
        endDate
    );
  },
});
