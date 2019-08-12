import $ from "jquery";
import _ from "underscore";
import commonTpl from "common/tpl";
import commonData from "./data";
import "lib/jquery.seeBind";
$.seeBind.bind("data-select-date", "[data-select-date=\"{{index}}\"]", "val");
$.seeBind.bind("pagination-content", "[data-pagination-content=\"{{page}}\"]" + "[data-start-date=\"{{startDate}}\"][data-end-date=\"{{endDate}}\"]", function ($el, data) {
  var htmlString = "";
  data.map(function (item) {
    htmlString += commonData.tpl.detailUnit.render(item);
  });
  $el.html(htmlString || commonTpl.noData);
});
$.seeBind.bind("pagination", "[data-pagination]" + "[data-start-date=\"{{startDate}}\"][data-end-date=\"{{endDate}}\"]", function ($el, data) {
  var i = 1, il = data.totalPages;
  data.pages = [];
  for (; i <= il; i++) data.pages.push(i);
  $el.html(commonData.tpl.pagination.render(data));
});
