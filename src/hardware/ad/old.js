import $ from "jquery";
import commonVars from "common/variables";
import data from "./data";
import func from "./function";
import "./ajax";
import "./view";
$.ajaxSetup({
  cache: !1
});
func.requestAds();
$("#machine-name").text(decodeURIComponent(commonVars.params.name));
