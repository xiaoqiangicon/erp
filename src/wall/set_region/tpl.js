import $ from 'jquery';
import juicer from 'juicer';
var tpl = {
  detail: juicer($('#tpl-detail').html()),
  priceRow: juicer($('#tpl-price-row').html()),
  priceShowRow: juicer($('#tpl-price-show-row').html()),
  hover: juicer($('#tpl-hover').html()),
};
export default tpl;
