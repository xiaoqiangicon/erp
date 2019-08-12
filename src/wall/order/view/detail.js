import $ from "jquery";
import toastr from "toastr";
import commonFunc from "common/function";
import commonVars from "common/variables";
import ChooseImage from "../../../../old-com/choose-image/src";
import data from "../data";
import tpl from "../tpl";
import util from "./util";
import "../ajax";
import "lib/jquery.seeView";
import "component/choose_image_config/index";
var upload;
$.seeView({
  events: {
    "!click #detail-popup-save-memo": "onClickDetailPopupSaveMemo",
    "!click #detail-popup-save": "onClickDetailPopupSave",
    "!click #detail-popup-feed-upload": "onClickDetailPopupFeedUpload",
    "click [data-feed-image-item-delete]": "onClickFeedImageItemDelete"
  },
  onClickDetailPopupSaveMemo: function (e) {
    var memo = $("#detail-popup-memo").val();
    $.seeAjax.get("saveMemo", {
      id: data.currentDetailPopupId,
      memo: memo
    }, function (res) {
      if (res.success) {
        toastr.success("保存成功");
      } else {
        toastr.error(res.message || "保存失败，请稍后再试");
      }
    });
  },
  onClickDetailPopupSave: function (e) {
    var self = this, $items = $("[data-feed-image-item]"), images = [];
    $items.map(function () {
      images.push($(this).attr("data-image"));
    });
    $.seeAjax.post("handle", {
      id: data.currentDetailPopupId,
      type: data.currentTabType - 1,
      image: images.join(",")
    }, function (res) {
      if (res.success) {
        $("#detail-popup").hide();
        $("body").removeClass("overflow-hidden");
        util.refreshCurrentPage();
        toastr.success("保存成功");
      } else {
        toastr.error(res.message || "保存失败，请稍后再试");
      }
    });
  },
  onClickDetailPopupFeedUpload: function (e) {
    var self = this;
    if (!upload) {
      upload = new ChooseImage({
        multiSelect: !0,
        onSubmit: function (images) {
          self.afterUploadImages(images);
        }
      });
    }
    upload.show();
  },
  afterUploadImages: function (images) {
    var self = this, $originItems = $("[data-feed-image-item]"), originImages = [];
    $originItems.map(function () {
      originImages.push($(this).attr("data-image"));
    });
    images && images.map(function (item) {
      originImages.length < 10 && originImages.push(item.src);
    });
    self.saveFeedImages(originImages);
  },
  saveFeedImages: function (images) {
    var self = this;
    $.seeAjax.post("updateFeedImage", {
      id: data.currentDetailPopupId,
      type: 2 - data.currentTabType,
      image: images.join(",")
    }, function (res) {
      if (res.success) {
        toastr.success("更新图片成功");
        self.renderFeedImages(images);
      } else {
        toastr.error(res.message || "更新图片失败，请稍后再试");
      }
    });
  },
  renderFeedImages: function (images) {
    var $container = $("#detail-popup-feed-images"), $upload = $("#detail-popup-feed-upload").parent();
    $container.html("");
    images.map(function (image) {
      $container.append(tpl.imageCell.render({
        image: image
      }));
    });
    if (images.length >= 10) $upload.addClass("hide"); else $upload.removeClass("hide");
  },
  onClickFeedImageItemDelete: function (e) {
    var $this = $(e.target).parent();
    var self = this, $originItems = $("[data-feed-image-item]"), originImages = [];
    $originItems.map(function () {
      var self = this;
      if (self != $this[0]) originImages.push($(self).attr("data-image"));
    });
    self.saveFeedImages(originImages);
  }
});
