define(['jquery', 'juicer'], function($) {
  var tpl = {
    unit: juicer($('#tpl-unit').html()),
  };

  return tpl;
});
