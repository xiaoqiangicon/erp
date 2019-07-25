/**
 * Created by senntyou on 2017/8/23.
 */

define(['jquery', 'juicer'], function($) {
  var tpl = {
    detail: juicer($('#tpl-detail').html()),
    priceRow: juicer($('#tpl-price-row').html()),
    priceShowRow: juicer($('#tpl-price-show-row').html()),
    hover: juicer($('#tpl-hover').html()),
  };

  return tpl;
});
