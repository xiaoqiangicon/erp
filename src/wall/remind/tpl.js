import $ from 'jquery';
import 'juicer';
var tpl = {
  row: juicer($('#tpl-row').html()),
  pagination: juicer($('#tpl-pagination').html()),
  regionCell: juicer($('#tpl-region-cell').html()),
  sendInputCell: juicer($('#tpl-send-input-cell').html()),
};
export default tpl;
