import "bootstrap/dist/css/bootstrap.css";
import "../../../old-com/ie-tip/src/css/index.css";
import "../../less/base.less";
import "./index.css";
import "../../../old-com/ie-tip/src";
import "bootstrap";
import $ from "jquery";
import data from "./js/data";
import init from "./js/init";
import "./js/view";
import "../../com/report";
$.ajaxSetup({
  cache: !1
});
$.getJSON(data.url, {}, res => {
  init(res);
});
