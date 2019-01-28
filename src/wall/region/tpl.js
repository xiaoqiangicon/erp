/**
 * Created by senntyou on 2017/8/23.
 */

define(['jquery', 'juicer'], function($) {
  var tpl = {
    unit: juicer($('#tpl-unit').html()),
    createTypeCell: juicer($('#tpl-create-type-cell').html()),
    option: juicer($('#tpl-option').html()),
  };

  return tpl;
});
