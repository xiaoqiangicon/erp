/**
 * Created by senntyou on 2017/8/23.
 */

define(['jquery', 'juicer'], function($) {
  var tpl = {
    detail: juicer($('#tpl-detail').html()),
    contact: juicer($('#tpl-contact').html()),
    contactUnit: $('#tpl-contact-unit').html(),
    option: juicer($('#tpl-option').html()),
    regionCell: juicer($('#tpl-region-cell').html()),
    hover: juicer($('#tpl-hover').html()),
  };

  return tpl;
});
