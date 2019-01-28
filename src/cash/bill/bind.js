/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'underscore', './tpl', 'lib/jquery.seeBind'], function(
  $,
  _,
  tpl
) {
  // 设置选择的年
  $.seeBind.bind(
    'data-selected-year',
    '[data-selected-year][data-status="{{status}}"]',
    function($el, year) {
      $el
        .attr({
          'data-selected-year': year,
        })
        .text(year + '年');
    }
  );
  /**
   * 年内容
   */
  $.seeBind.bind(
    'year-content',
    '[data-year-content="{{year}}"][data-status="{{status}}"]',
    function($el, data) {
      $el.html(tpl.contentUnit.render(data));
    }
  );
});
