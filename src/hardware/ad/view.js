import $ from "jquery";
import toastr from "toastr";
import commonFunc from "common/function";
import data from "./data";
import tpl from "./tpl";
import func from "./function";
import "lib/jquery.seeView";
toastr.options.positionClass = "toast-bottom-full-width";
toastr.options.timeOut = 2000;
$.seeView({
  events: {
    "click [data-row-switch]": "onClickRowSwitch"
  },
  onClickRowSwitch: function (e) {
    var $this = $(e.target), id = parseInt($this.attr("data-row-switch")), hide = parseInt($this.attr("data-hide")) || 0, targetHide = 1 - hide;
    $.seeAjax.post("switch", {
      id: id,
      hide: targetHide
    }, function (res) {
      if (res.success) {
        $this.attr({
          "data-hide": targetHide
        }).text(["隐藏", "显示"][targetHide]);
        var $row = $("[data-row=\"" + id + "\"]");
        var $hide = $("[data-row-hide=\"" + id + "\"]");
        $hide.text(["显示", "隐藏"][targetHide]);
        if (targetHide) {
          $row.addClass("hided");
          $this.addClass("btn-show").removeClass("btn-hide");
        } else {
          $row.removeClass("hided");
          $this.removeClass("btn-show").addClass("btn-hide");
        }
        toastr.success("切换状态成功");
      } else {
        toastr.error("切换状态失败，请稍后再试");
      }
    });
  }
});
