import $ from 'jquery';
import * as orchids from 'orchids';
import util from '../util';
import data from '../data';
import tpl from '../tpl';
import seeView from 'see-view';
import seeAjax from 'see-ajax';

seeView({
  events: {
    'click #detail-close': 'onClickDetailClose',
    'click #upload-receipt-tip': 'onClickUploadReceiptTip',
    'click [data-status-sort]': 'onClickStatusSort',
  },
  onClickDetailClose: function(e) {
    orchids.back();
  },
  onClickUploadReceiptTip: function(e) {
    $('#dialog-receipt-tip').show();
    util.disableBodyScroll();
  },
  onClickStatusSort: function(e) {
    if ($(e.target).hasClass('btn-green')) return;
    // $('[data-status-sort]').removeClass('btn-green');

    let sumType = $(e.target).attr('data-status-sort-action');
    var item = data.listItems[data.id];

    seeAjax('getPickUpDetails', { id: data.id, sumType: sumType }, res => {
      var singleItem = Object.assign(item, res.data[0]);
      $('[data-orchids-name="detail"]').html(tpl.detail.render(singleItem));
      $(`[data-status-sort-action=${sumType}]`).addClass('btn-green');
      // 2项目汇总 1时间汇总
      if (sumType == 1) {
        $('[data-detail="1"]').hide();
      } else {
        $('[data-detail="1"]').show();
      }
      // $('[data-status-sort]')
      //   .eq(sumType - 1)
      //   .addClass('btn-green')
      //   .siblings()
      //   .removeClass('btn-green');
      $('#detail-summary-right-unit').css({
        height: $('#detail-summary-left-unit').outerHeight(),
      });
    });
  },
});
