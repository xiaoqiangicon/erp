import $ from "jquery";
import orchids from "orchids";
import fn from "common/function";
import data from "../data";
import func from "../func";
import util from "../util";
import tpl from "../tpl";
import "lib/jquery.seeView";
import "@fancyapps/fancybox";
var $receiptsContent = $("#dialog-receipts-content");
$.seeView({
  events: {
    "click [data-select-status]": "onClickSelectStatus",
    "click [data-unit-cancel]": "onClickUnitCancel",
    "click [data-unit-scan]": "onClickUnitScan",
    "click [data-unit-show-answer]": "onClickUnitShowAnswer",
    "click [data-unit-upload-receipts]": "onClickUnitUploadReceipts"
  },
  onClickSelectStatus: function (e) {
    var self = this, $this = $(e.target), status = parseInt($this.attr("data-select-status"));
    $("[data-select-status].active").removeClass("active");
    $this.addClass("active");
    data.filter.status = status;
    func.requestList();
  },
  onClickUnitCancel: function (e) {
    var self = this, $this = $(e.target), id = $this.attr("data-unit-cancel");
    setTimeout(function () {
      fn.confirm("确定撤回这次提现吗？", function () {
        $.seeAjax.get("cancel", {
          id: id
        }, function (res) {
          res.success && self.onCancelFlowSuccess(id);
        });
      });
    }, 200);
  },
  onCancelFlowSuccess: function (id) {
    $("[data-unit=\"" + id + "\"]").remove();
    delete data.listItems[id];
  },
  onClickUnitScan: function (e) {
    var $this = $(e.target), id = parseInt($this.attr("data-unit-scan"));
    orchids.startPage("detail", {
      id: id
    }, {
      beforeAppInitialized: !0
    });
  },
  onClickUnitShowAnswer: function (e) {
    var $this = $(e.target), answer = $this.attr("data-answer");
    fn.dialog("回复信息", answer);
  },
  onClickUnitUploadReceipts: function (e) {
    var $this = $(e.target), id = parseInt($this.attr("data-unit-upload-receipts")), receiptsString = $this.attr("data-receipts");
    $receiptsContent.html("");
    receiptsString && receiptsString.split(",").map(function (image) {
      $receiptsContent.append(tpl.popupReceiptsRow.render({
        src: image
      }));
    });
    data.currentHandleId = id;
    $("#dialog-receipts").show();
    util.disableBodyScroll();
  }
});
