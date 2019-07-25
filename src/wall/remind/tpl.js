/**
 * Created by senntyou on 2017/8/23.
 */

define(['jquery', 'juicer'], function($) {
  var tpl = {
    row: juicer($('#tpl-row').html()),
    pagination: juicer($('#tpl-pagination').html()),
    regionCell: juicer($('#tpl-region-cell').html()),
    sendInputCell: juicer($('#tpl-send-input-cell').html()),
  };

  return tpl;
});
