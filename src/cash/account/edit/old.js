import $ from "jquery";
import func from "./func";
import "./view";
import "bootstrap-select";
$.ajaxSetup({
  cache: !1
});
func.init();
$("#input-bank").selectpicker({
  width: "264px",
  liveSearch: !0
});
