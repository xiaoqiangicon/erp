import $ from "jquery";
import _ from "underscore";
import toastr from "toastr";
import commonFunc from "common/function";
import commonVars from "common/variables";
import data from "../data";
import tpl from "../tpl";
import func from "../function";
import util from "./util";
import "../ajax";
import "lib/jquery.seeView";
$.seeView({
  events: {
    "!click #hover-popup-no": "onClickHoverPopupNo",
    "!click #hover-popup-ok": "onClickHoverPopupOk"
  },
  onClickHoverPopupNo: function (e) {
    util.resetHoverPopup();
    util.hideHoverPopup();
  },
  onClickHoverPopupOk: function (e) {
    util.fillCreatePopup();
    util.showCreatePopup();
  }
});
