import $ from "jquery";
import commonFunc from "common/function";
import data from "./data";
import tpl from "./tpl";
import "./ajax";
var $contentBody = $("#content-body");
var func = {};
func.init = function () {
  func.requestList();
};
func.requestList = function () {
  $.seeAjax.get("list", {}, function (res) {
    if (res.success) {
      res.data.map(function (item) {
        $contentBody.append(tpl.unit.render(item));
      });
    }
  });
};
export default func;
