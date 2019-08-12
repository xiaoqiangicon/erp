import $ from "jquery";
import commonFunc from "common/function";
import tpl from "./tpl";
import data from "./data";
import Pagination from "../../../old-com/pagination/src";
import "./ajax";
var func = {};
func.init = function () {
  $("#loading-toast").addClass("hide");
  $(".input-daterange").datepicker({
    keyboardNavigation: false,
    language: "zh-CN",
    todayHighlight: true,
    forceParse: false,
    autoclose: true,
    clearBtn: false,
    format: "yyyy-mm-dd",
    pickerPosition: "bottom-left"
  });
  $(".input-daterange input").each(function () {
    $(this).datepicker("clearDates");
  });
  func.getCash(data.getCashParams, function (res) {
    func.renderCash(res);
  });
  func.getList(data.getListParams, function (res) {
    func.renderList(res);
  });
};
func.getCash = function (params, callback) {
  $.seeAjax.get("getCash", params, function (res) {
    if (res.success) {
      data.getCashRes = res;
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.renderCash = function (res) {
  $("#total-cash").html(res.total);
  $("#month-cash").html(res.month);
  $("#day-cash").html(res.day);
};
func.getList = function (params, callback) {
  $.seeAjax.get("getList", params, function (res) {
    if (res.success) {
      data.getListRes = res;
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.renderList = function (res) {
  var $container = $("#watchword-list-container"), htmlStr = "";
  res.data.map(function (item) {
    htmlStr += tpl.tableCell.render(item);
  });
  !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
  $container.html(htmlStr);
  func.createPagination(res);
};
func.createPagination = function (res) {
  var $prevPage = $("#prevPage"), $nextPage = $("#nextPage");
  if (data.getListParams.pageNum === 0) {
    $prevPage.addClass("hide");
  } else {
    $prevPage.removeClass("hide");
  }
  if (res.pageNumber !== -1) {
    $nextPage.removeClass("hide");
  } else {
    $nextPage.addClass("hide");
  }
};
export default func;
