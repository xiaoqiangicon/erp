import $ from 'jquery';
import juicer from 'juicer';
var tpl = {
  unit: juicer($('#tpl-unit').html()),
  templateCell: juicer($('#tpl-template-cell').html()),
  hoverRow: juicer($('#tpl-hover-row').html()),
};
export default tpl;
