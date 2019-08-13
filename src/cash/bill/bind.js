import $ from 'jquery';
import _ from 'underscore';
import tpl from './tpl';
import 'lib/jquery.seeBind';
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
$.seeBind.bind(
  'year-content',
  '[data-year-content="{{year}}"][data-status="{{status}}"]',
  function($el, data) {
    $el.html(tpl.contentUnit.render(data));
  }
);
