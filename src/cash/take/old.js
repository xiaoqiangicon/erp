/**
 * Created by senntyou on 2016/12/5.
 */
define([
  'jquery',
  'common/upload',
  './data',
  './tpl',
  './func',
  './view',
  './orchids',
  'lib/bootstrap-material-datetimepicker',
], function($, commonUpload, data, tpl, func) {
  //设置AJAX的全局默认选项
  $.ajaxSetup({
    cache: !1, // 禁用缓存
  });

  // 时间选取控件
  $('[data-select-date]').bootstrapMaterialDatePicker({
    time: false,
    lang: 'zh-cn',
    cancelText: '取消',
    okText: '确定',
    clearText: '清除',
    nowText: '现在',
    clearButton: true,
  });

  // 获取账户信息
  $.seeAjax.get('accountInfo', {}, function(res) {
    if (res.success) {
      // 0 待审核 1 审核通过 2 审核不通过
      data.accountData = res.data;

      if (res.data && res.data.account) {
        $('#account-name').text(res.data.account);
        $('#account-number').text(res.data.bankCard);
        $('#tip-section-info').show();
      }
      // 审核失败的原因
      if (data.accountStatus === 2 && res.data.reason) {
        $('#dialog-account-no-reason-content').text(res.data.reason);
        $('#dialog-account-no-reason').removeClass('hide');
      }
    }
  });

  var $receiptsContent = $('#dialog-receipts-content');
  // 初始化上传
  commonUpload('#dialog-receipts-add-input', function(url) {
    $receiptsContent.append(tpl.popupReceiptsRow.render({ src: url }));
  });

  // 初始化页面
  func.init();
});
