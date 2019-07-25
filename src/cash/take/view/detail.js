/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'orchids', '../util', 'lib/jquery.seeView'], function(
  $,
  orchids,
  util
) {
  $.seeView({
    events: {
      // 点击关闭详情弹出框
      'click #detail-close': 'onClickDetailClose',
      // 点击查看如果上传收据
      'click #upload-receipt-tip': 'onClickUploadReceiptTip',
    },
    // 点击关闭详情弹出框
    onClickDetailClose: function(e) {
      orchids.back();
    },
    // 点击查看如果上传收据
    onClickUploadReceiptTip: function(e) {
      $('#dialog-receipt-tip').show();
      util.disableBodyScroll();
    },
  });
});
