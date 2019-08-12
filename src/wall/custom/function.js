import $ from "jquery";
import _ from "underscore";
import commonFunc from "common/function";
import commonTpl from "common/tpl";
import data from "./data";
import tpl from "./tpl";
import "./ajax";
var func = {};
var $contentBody = $("#content-body");
var $pagination = $("#pagination");
func.init = function () {
  $.seeAjax.get("houses", {}, function (res) {
    if (res.success && res.data && res.data.length) {
      var $select = $("#filter-house");
      res.data.map(function (item) {
        item.id = item.name;
        $select.append(tpl.option.render(item));
      });
    }
  });
  $.seeAjax.get("regions", {}, function (res) {
    if (res.success && res.data && res.data.length) {
      var $select = $("#filter-region");
      res.data.map(function (item) {
        $select.append(tpl.regionCell.render(item));
      });
    }
  });
  func.requestOrdersList();
};
func.requestOrdersList = function (page) {
  $contentBody.html(commonTpl.loading);
  $pagination.html("");
  !page && (page = 1);
  var params = _.clone(data.ordersFilter);
  params.page = page;
  $.seeAjax.get("orders", params, function (res) {
    if (res.success) {
      res.data && res.data.length && res.data.map(function (item) {
        data.listData[item.id] = item;
      });
      $contentBody.html("");
      func.renderList(res, page);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.renderList = function (res, page) {
  if (res.data && res.data.length) {
    res.data.map(function (item) {
      $contentBody.append(tpl.row.render(item));
    });
    var i, il, pages = [];
    for ((i = 0, il = res.totalPages); i < il; i++) pages.push(i + 1);
    $pagination.html(tpl.pagination.render({
      currentPage: page,
      totalPages: res.totalPages,
      pages: pages
    }));
  } else {
    $contentBody.html(commonTpl.noData);
  }
};
export default func;
