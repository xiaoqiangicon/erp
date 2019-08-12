import $ from "jquery";
import commonFunc from "common/function";
import data from "./data";
import func from "./function";
import "./view";
import "bootstrap-datetime-picker";
import "bootstrap-datetime-picker/js/locales/bootstrap-datetimepicker.zh-CN";
$.ajaxSetup({
  cache: !1,
  error: function () {
    commonFunc.dialog("网络链接错误，请稍后重试");
    $("[data-save=\"1\"]").attr({
      "data-handling": 0
    }).text(data.saveTypeOriginText[0]);
    $("[data-save=\"2\"]").attr({
      "data-handling": 0
    }).text(data.saveTypeOriginText[1]);
  }
});
commonFunc.addCloseWindowHint();
data.editor = UE.getEditor("input-content", {
  initialFrameWidth: 700,
  initialFrameHeight: 400
});
data.editor.addListener("ready", function (editor) {
  func.init();
});
$("#input-publish-time").datetimepicker({
  format: "yyyy-mm-dd hh:ii:ss",
  language: "zh-CN",
  autoclose: true,
  forceParse: !1
});
if (data.formatedParams.action == "add") {
  $("#tip-section").show();
}
