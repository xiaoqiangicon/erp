/**
 * Created by senntyou on 2017/8/23.
 */

define(['jquery', 'juicer'], function($) {
  var tpl = {
    unit: juicer($('#tpl-unit').html()),
    templateCell: juicer($('#tpl-template-cell').html()),
    hoverRow: juicer($('#tpl-hover-row').html()),
  };

  return tpl;
});
