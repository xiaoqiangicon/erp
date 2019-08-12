import $ from "jquery";
import Pagination from "../../../old-com/pagination/src";
import commonFunc from "common/function";
import commonTpl from "common/tpl";
import data from "./data";
import tpl from "./tpl";
import "./ajax";
var func = {};
func.init = function () {
  $.seeAjax.get("categories", {}, function (res) {
    var $container = $("#category-dropdown-menu");
    if (res.success) {
      res.data.map(function (item) {
        $container.append(tpl.categoryCell.render(item));
      });
      func.requestList();
    }
  });
};
const $listContainer = $("#list-container");
const $paginationContainer = $("#pagination-container");
const requestList = (page = 1, init = !0) => {
  $listContainer.html(commonTpl.loading);
  init && $paginationContainer.html("");
  $.seeAjax.get("list", {
    ...data.filter,
    page
  }, res => {
    if (!res.success || !res.data || !res.data.length) {
      $listContainer.html(commonTpl.noData);
      return;
    }
    let html = "";
    res.data.map(function (item) {
      html += tpl.articleCell.render(item);
    });
    $listContainer.html(html);
    if (init) {
      data.pagination = new Pagination("#pagination-container", {
        totalPages: res.totalPages,
        onChange: page => {
          requestList(page, !1);
          data.pagination.render();
        }
      });
      data.pagination.render();
    }
    $(window).scrollTop(0);
  });
};
func.requestList = requestList;
export default func;
