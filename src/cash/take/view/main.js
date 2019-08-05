/**
 * Created by senntyou on 2017/3/29.
 */
define([
  'jquery',
  'orchids',
  'common/variables',
  'common/function',
  '../data',
  '../func',
  '../util',
  'lib/jquery.seeView',
  '@fancyapps/fancybox',
], function($, orchids, commonVars, fn, data, func, util) {
  var specialDateIntervals = [0, 1, 3, 12];

  $.seeView({
    events: {
      // 时间选择变化
      'change [data-select-date]': 'onChangeSelectDate',
      // 点击特殊日期，今天，3个月，一年
      'click [data-special-date]': 'onClickSpecialDate',
      // 点击关闭对话框
      'click [data-dialog-close]': 'onClickDialogClose',
      // 点击申请提现按钮
      '!click #action-take': 'onClickActionTake',
    },
    // 选择某一年
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
        // 应测试要求，这里要恢复到之前选择的时间
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
    // 点击特殊日期，今天，3个月，一年
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
    // 点击关闭对话框
    onClickDialogClose: function(e) {
      var $this = $(e.target);
      $this.parents('.dialog').hide();
      if (!orchids.getCurrentPage()) util.enableBodyScroll();
    },
    // 点击申请提现按钮
    onClickActionTake: function() {
      // 未提交过账户申请
      if (data.accountStatus == -1) {
        location.href = '/static/build/cash/account/index.html';
      }
      // 正在审核
      else if (data.accountStatus === 0) {
        $('#dialog-account-pending').show();
        util.disableBodyScroll();
      }
      // 审核通过
      else if (data.accountStatus === 1) {
        location.href = '/zzhadmin/cashBill/';
      }
      // 审核不通过
      else if (data.accountStatus === 2) {
        $('#dialog-account-no').show();
        util.disableBodyScroll();
      }
    },
  });
});
