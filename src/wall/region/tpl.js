import $ from 'jquery';
import juicer from 'juicer';
var tpl = {
  unit: juicer($('#tpl-unit').html()),
  createTypeCell: juicer($('#tpl-create-type-cell').html()),
  option: juicer($('#tpl-option').html()),
};
export default tpl;
