import $ from 'jquery';
import juicer from 'juicer';
var tpl = {
  row: juicer($('#tpl-row').html()),
  pagination: juicer($('#tpl-pagination').html()),
  regionCell: juicer($('#tpl-region-cell').html()),
  contactCell: juicer($('#tpl-contact-cell').html()),
  imageCell: juicer($('#tpl-image-cell').html()),
  printerCell: juicer($('#tpl-printer-cell').html()),
  option: juicer($('#tpl-option').html()),
};
export default tpl;
