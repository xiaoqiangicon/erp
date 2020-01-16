import $ from 'jquery';
import juicer from 'juicer';
var tpl = {
  selectYearItem: juicer($('#tpl-select-year-item').html()),
  yearContentContainer: juicer($('#tpl-year-content-container').html()),
  placeholder: $('#tpl-placeholder').html(),
  contentUnit: juicer($('#tpl-content-unit').html()),
};
export default tpl;
