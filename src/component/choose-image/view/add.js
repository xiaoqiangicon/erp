import seeAjax from "see-ajax";
import seeView from "see-view";
import $ from "jquery";
import data from "../data";
import requestList from "../util/request_list";
import revertWinScroll from "../util/revert_win_scroll";
import uploadImageCellTpl from "../tpl/upload_image_cell";
seeView({
  events: {
    "click [data-zzh-choose-image-add-popup]": "onClickAddPopup",
    "click [data-zzh-choose-image-upload-image-delete]": "onClickUploadImageDelete",
    "click [data-zzh-choose-image-extract-submit]": "onClickExtractSubmit",
    "click [data-zzh-choose-image-tab-2]": "onClickTab2",
    "click [data-zzh-choose-image-add-submit]": "onClickAddSubmit"
  },
  onClickAddPopup: e => {
    let $this = $(e.target);
    let close = $this.attr("data-popup-close") || $this.attr("data-popup-backdrop") || $this.parent().attr("data-popup-close");
    if (close) {
      $this.parents("[data-zzh-choose-image-add-popup]").hide();
    }
  },
  onClickUploadImageDelete: e => {
    $(e.target).parent().remove();
  },
  onClickExtractSubmit: function (e) {
    let self = this;
    let $this = $(e.target);
    let $addPopup = $this.parents("[data-zzh-choose-image-add-popup]");
    let id = parseInt($addPopup.attr("data-zzh-choose-image-add-popup"));
    let $input = $addPopup.find("[data-zzh-choose-image-extract-input]");
    let url = $input.val();
    if (!url) return;
    let image = new Image();
    image.src = url;
    image.onload = () => {
      self.extractImageSuccessful(url, id, $addPopup);
      $input.val("");
    };
    image.onerror = () => {
      self.extractImageFailed(url);
    };
  },
  extractImageSuccessful: function (url, id, $addPopup) {
    let self = this;
    seeAjax("zzhChooseImageExtract", {
      file: url
    }, res => {
      if (res.success) self.saveExtractedImageSuccessful(res.url, id, $addPopup);
    });
  },
  saveExtractedImageSuccessful: function (url, id, $addPopup) {
    $addPopup.find("[data-zzh-choose-image-extract-content]").append(uploadImageCellTpl({
      image: url
    }));
  },
  extractImageFailed: function (url) {
    let fn = window.zzhChooseImageExtractFail || alert;
    fn("图片获取失败，请检查图片地址是否正确，然后重新尝试");
  },
  onClickTab2: e => {
    let $this = $(e.currentTarget);
    let $addPopup = $this.parents("[data-zzh-choose-image-add-popup]");
    let tabId = parseInt($this.attr("data-zzh-choose-image-tab-2"));
    if ($this.hasClass("active")) return;
    $addPopup.find("[data-zzh-choose-image-tab-2]").removeClass("active");
    $addPopup.find("[data-zzh-choose-image-tab-2-container]").hide();
    $this.addClass("active");
    $addPopup.find(`[data-zzh-choose-image-tab-2-container="${tabId}"]`).show();
  },
  onClickAddSubmit: function (e) {
    let self = this;
    let $this = $(e.target);
    let $addPopup = $this.parents("[data-zzh-choose-image-add-popup]");
    let id = parseInt($addPopup.attr("data-zzh-choose-image-add-popup"));
    let $imageCells = $addPopup.find("[data-zzh-choose-image-upload-image-cell]");
    let images = [];
    let handling = !!parseInt($this.attr("data-handling"));
    if (handling) return;
    if (!$imageCells.length) {
      $addPopup.hide();
      return;
    }
    $imageCells.map(function () {
      images.push($(this).attr("data-image-src"));
    });
    $this.attr({
      "data-handling": 1
    }).text("正在保存图片...");
    seeAjax("zzhChooseImageAdd", {
      images: JSON.stringify(images)
    }, res => {
      if (res.success) {
        $this.attr({
          "data-handling": 0
        }).text("确认");
        $imageCells.remove();
        $addPopup.hide();
        self.saveImageSuccessful(id, images);
      }
    });
  },
  saveImageSuccessful: function (id, images) {
    let $chooseImage = $(`[data-zzh-choose-image="${id}"]`);
    let $tab1_1 = $chooseImage.find("[data-zzh-choose-image-tab-1=\"1\"]");
    if ($tab1_1.hasClass("active")) requestList(id); else $tab1_1.trigger("click");
    if (images.length) {
      let result = [];
      images.map(image => {
        result.push({
          id: 0,
          src: image
        });
      });
      let option = data.options[id];
      option.onSubmit && option.onSubmit(result);
      revertWinScroll();
      $chooseImage.find("[data-zzh-choose-image-cell].active").removeClass("active");
      $chooseImage.hide();
    }
  }
});
