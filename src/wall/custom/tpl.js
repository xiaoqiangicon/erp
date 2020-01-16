import $ from 'jquery';
import juicer from 'juicer';
var tpl = {
  row: juicer($('#tpl-row').html()),
  option: juicer($('#tpl-option').html()),
  pagination: juicer($('#tpl-pagination').html()),
  regionCell: juicer($('#tpl-region-cell').html()),
  contactCell: juicer($('#tpl-contact-cell').html()),
};
export default tpl;
