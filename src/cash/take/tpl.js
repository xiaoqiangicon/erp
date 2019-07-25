/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'juicer'], function($) {
  // 模板
  var tpl = {
    unit: juicer($('#tpl-unit').html()),
    detail: juicer($('#tpl-detail').html()),
    popupReceiptsRow: juicer($('#tpl-popup-receipts-row').html()),
  };

  return tpl;
});
