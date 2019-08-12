import $ from "jquery";
import orchids from "orchids";
import util from "../util";
import "lib/jquery.seeView";
$.seeView({
  events: {
    "click #detail-close": "onClickDetailClose",
    "click #upload-receipt-tip": "onClickUploadReceiptTip"
  },
  onClickDetailClose: function (e) {
    orchids.back();
  },
  onClickUploadReceiptTip: function (e) {
    $("#dialog-receipt-tip").show();
    util.disableBodyScroll();
  }
});
