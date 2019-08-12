import $ from "jquery";
import _ from "underscore";
import commonFunc from "common/function";
import commonTpl from "common/tpl";
import data from "./data";
import tpl from "./tpl";
import "./ajax";
var func = {};
var $contentBody = $("#content-body");
func.init = function () {
  func.requestList();
};
func.requestList = function () {
  $.seeAjax.get("list", {}, function (res) {
    if (res.success) {
      func.renderList(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.renderList = function (res) {
  var htmlString = "";
  res.data && res.data.length && res.data.map(function (item) {
    htmlString += tpl.unit.render(item);
  });
  $contentBody.html(htmlString);
};
export default func;
