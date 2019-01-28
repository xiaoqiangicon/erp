/**
 * Created by senntyou on 2017/8/23.
 */

define(['jquery', 'juicer'], function($) {
  var tpl = {
    row: juicer($('#tpl-row').html()),
    option: juicer($('#tpl-option').html()),
    pagination: juicer($('#tpl-pagination').html()),
    regionCell: juicer($('#tpl-region-cell').html()),
    contactCell: juicer($('#tpl-contact-cell').html()),
  };

  return tpl;
});
