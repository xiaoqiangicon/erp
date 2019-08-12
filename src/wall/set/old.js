import $ from "jquery";
import func from "./function";
import data from "./data";
import "./view";
$.ajaxSetup({
  cache: !1
});
data.editor = UE.getEditor("input-intro", {
  initialFrameWidth: 700,
  initialFrameHeight: 400
});
data.editor.addListener("ready", function (editor) {
  func.init();
});
