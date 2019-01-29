/**
 * Created by senntyou on 2017/7/18.
 */

define(['jquery', 'juicer'], function($) {
  var tpl = {
    row: juicer($('#tpl-row').html()),
  };

  return tpl;
});
