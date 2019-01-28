/**
 * Created by senntyou on 2017/8/23.
 */

define(['jquery', 'juicer'], function($) {
  var tpl = {
    row: juicer($('#tpl-row').html()),
    pagination: juicer($('#tpl-pagination').html()),
    regionCell: juicer($('#tpl-region-cell').html()),
    contactCell: juicer($('#tpl-contact-cell').html()),
    imageCell: juicer($('#tpl-image-cell').html()),
    printerCell: juicer($('#tpl-printer-cell').html()),
    option: juicer($('#tpl-option').html()),
  };

  return tpl;
});
