/**
 * Created by senntyou on 2017/3/29.
 */
define([
  'jquery',
  'orchids',
  'common/function',
  '../data',
  '../func',
  '../util',
  '../tpl',
  'lib/jquery.seeView',
  '@fancyapps/fancybox',
], function($, orchids, fn, data, func, util, tpl) {
  var $receiptsContent = $('#dialog-receipts-content');

  $.seeView({
    events: {
      // 选择状态
      'click [data-select-status]': 'onClickSelectStatus',
      // 撤回提现
      'click [data-unit-cancel]': 'onClickUnitCancel',
      // 查看订单
      'click [data-unit-scan]': 'onClickUnitScan',
      // 点击查看回复
      'click [data-unit-show-answer]': 'onClickUnitShowAnswer',
      // 点击上传回单照片
      'click [data-unit-upload-receipts]': 'onClickUnitUploadReceipts',
    },
    // 选择状态
    onClickSelectStatus: function(e) {
      var self = this,
        $this = $(e.target),
        status = parseInt($this.attr('data-select-status'));

      $('[data-select-status].active').removeClass('active');
      $this.addClass('active');

      data.filter.status = status;
      func.requestList();
    },
    // 撤回提现
    onClickUnitCancel: function(e) {
      var self = this,
        $this = $(e.target),
        id = $this.attr('data-unit-cancel');

      // 此处必须使用定时器，否则弹出框消失时会导致body滚动
      setTimeout(function() {
        fn.confirm('确定撤回这次提现吗？', function() {
          $.seeAjax.get('cancel', { id: id }, function(res) {
            res.success && self.onCancelFlowSuccess(id);
          });
        });
      }, 200);
    },
    // 撤销流水成功
    onCancelFlowSuccess: function(id) {
      $('[data-unit="' + id + '"]').remove();
      delete data.listItems[id];
    },
    // 查看订单
    onClickUnitScan: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-unit-scan'));

      orchids.startDialog('detail', { id: id });
    },
    // 点击查看回复
    onClickUnitShowAnswer: function(e) {
      var $this = $(e.target),
        answer = $this.attr('data-answer');

      fn.dialog('回复信息', answer);
    },
    // 点击上传回单照片
    onClickUnitUploadReceipts: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-unit-upload-receipts')),
        receiptsString = $this.attr('data-receipts');

      $receiptsContent.html('');
      receiptsString &&
        receiptsString.split(',').map(function(image) {
          $receiptsContent.append(tpl.popupReceiptsRow.render({ src: image }));
        });

      data.currentHandleId = id;

      $('#dialog-receipts').show();
      util.disableBodyScroll();
    },
  });
});
