import $ from 'jquery';
import _ from 'underscore';
import tpl from './tpl';

export const renderSelectedYear = (data, options) => {
  $(`[data-selected-year][data-status="${options.status}"]`)
    .attr({
      'data-selected-year': data,
    })
    .text(data + '年');
};

export const renderYearContent = data => {
  $(`[data-year-content="{{year}}"][data-status="${options.status}"]`).html(
    tpl.contentUnit.render(data)
  );
};
