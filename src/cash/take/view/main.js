import $ from 'jquery';
import * as orchids from 'orchids';
import commonVars from 'common/variables';
import fn from 'common/function';
import data from '../data';
import func from '../func';
import util from '../util';
import seeView from 'see-view';
import '@fancyapps/fancybox';
var specialDateIntervals = [0, 1, 3, 12];
seeView({
  events: {
    'change [data-select-date]': 'onChangeSelectDate',
    'click [data-special-date]': 'onClickSpecialDate',
    'click [data-dialog-close]': 'onClickDialogClose',
    '!click #action-take': 'onClickActionTake',
  },
  onChangeSelectDate: function(e) {
    var self = this,
      $this = $(e.target),
      $startDate = $('[data-select-date="1"]'),
      $endDate = $('[data-select-date="2"]'),
      startDate = $startDate.val(),
      startDateInt = !!startDate && util.getDateInt(startDate),
      endDate = $endDate.val(),
      endDateInt = !!endDate && util.getDateInt(endDate);
    if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
      fn.dialog('您选择的开始时间大于了结束时间，请重新选取');
      $startDate.val(data.lastStartDate);
      $endDate.val(data.lastEndDate);
      return;
    }
    data.lastStartDate = startDate;
    data.lastEndDate = endDate;
    data.filter.startDate = startDate;
    data.filter.endDate = endDate;
    func.requestList();
  },
  onClickSpecialDate: function(e) {
    var self = this,
      $this = $(e.target),
      type = parseInt($this.attr('data-special-date')),
      endDate = commonVars.today.display,
      startDate = util.getDateStartFromToday(specialDateIntervals[type - 1]),
      status = parseInt(
        $('[data-select-status].active').attr('data-select-status')
      );
    $('[data-select-date="1"]').val(startDate);
    $('[data-select-date="2"]').val(endDate);
    data.filter.startDate = startDate;
    data.filter.endDate = endDate;
    func.requestList();
  },
  onClickDialogClose: function(e) {
    var $this = $(e.target);
    $this.parents('.dialog').hide();
    if (!orchids.getCurrentPage()) util.enableBodyScroll();
  },
  onClickActionTake: function() {
    if (data.accountStatus == -1) {
      location.href = '/static/build/cash/account/index.html';
    } else if (data.accountStatus === 0) {
      $('#dialog-account-pending').show();
      util.disableBodyScroll();
    } else if (data.accountStatus === 1) {
      location.href = '/zzhadmin/cashBill/';
    } else if (data.accountStatus === 2) {
      $('#dialog-account-no').show();
      util.disableBodyScroll();
    }
  },
});
