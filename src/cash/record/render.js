import $ from 'jquery';
import _ from 'underscore';
import commonTpl from 'common/tpl';
import commonData from './data';

export const renderPaginationContent = (data, options) => {
  const $el = $(
    `[data-pagination-content="${options.page}"][data-start-date="${options.startDate}"][data-end-date="${options.endDate}"]`
  );

  var htmlString = '';
  data.map(function(item) {
    htmlString += commonData.tpl.detailUnit.render(item);
  });
  $el.html(htmlString || commonTpl.noData);
};

export const renderPagination = (data, options) => {
  const $el = $(
    `[data-pagination][data-start-date="${options.startDate}"][data-end-date="${options.endDate}"]`
  );

  var i = 1,
    il = data.totalPages;
  data.pages = [];
  for (; i <= il; i++) data.pages.push(i);
  $el.html(commonData.tpl.pagination.render(data));
};
