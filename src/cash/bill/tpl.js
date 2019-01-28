/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'juicer'], function($) {
  // 模板
  var tpl = {
    selectYearItem: juicer($('#tpl-select-year-item').html()),
    yearContentContainer: juicer($('#tpl-year-content-container').html()),
    placeholder: $('#tpl-placeholder').html(),
    contentUnit: juicer($('#tpl-content-unit').html()),
  };

  return tpl;
});
