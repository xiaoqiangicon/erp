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
    "!change #select-house": "onChangeSelectHouse",
    "!change #select-region": "onChangeSelectRegion",
    "!click #action-record": "onClickActionRecord",
    "click [data-popup-close]": "onClickPopupClose"
  },
  onChangeSelectHouse: function (e) {
    var value = $(e.target).val();
    var $selectRegion = $("#select-region");
    $selectRegion.find("option").map(function () {
      var $this = $(this), name = $this.attr("data-name"), id = parseInt($this.val());
      if (!id) return;
      if (!value) {
        $this.addClass("hide");
        return;
      }
      if (name.indexOf(value) === 0) $this.removeClass("hide"); else $this.addClass("hide");
    });
    $selectRegion.val(0);
    this.onChangeSelectRegion();
  },
  onChangeSelectRegion: function (e) {
    var $this = $("#select-region"), id = parseInt($this.val()), $actionRecord = $("#action-record");
    if (!id) {
      $("#content-body").html("");
      $actionRecord.addClass("hide");
    } else {
      func.requestRegion(id);
      $actionRecord.removeClass("hide");
    }
    data.currentRegionId = id;
    util.resetHoverPopup();
    util.hideHoverPopup();
  },
  onClickActionRecord: function (e) {
    util.fillCreatePopup();
    util.showCreatePopup();
  },
  onClickPopupClose: function (e) {
    $(e.target).parents(".modal").hide();
    $("body").removeClass("overflow-hidden");
  }
});
