import $ from "jquery";
import QRCode from "../../../old-com/qrcode";
import commonFunc from "common/function";
import Data from "./data";
import api from "./api";
import tpl from "./tpl";
import Pagination from "../../../old-com/pagination/src";
import commonVars from "common/variables";
import "./ajax";
import "bootstrap-select";
var func = {};
func.init = function () {
  var id = commonVars.params.id, numberAccount = commonVars.params.numberAccount;
  Data.getListParams.id = id;
  $("#loading-toast").addClass("hide");
  api.getList(Data.getListParams, function (res) {
    func.renderList(res);
    api.getUserInfo(Data.getUserInfoParams, function (res) {
      func.renderUserInfoCtnr(res);
    });
    api.getTag({
      userId: Data.getUserInfoParams.id
    }, function (res) {
      func.renderTag(res);
    });
  });
  $("#zizai_code").find("span").html(numberAccount);
};
func.renderList = function (res) {
  $("#head_pic").attr("src", res.data.pic);
  $("#user_name").text(res.data.name);
  $("#merit_total_money").text("¥" + res.data.money);
  $("#merit_total_number").text(res.data.payTimes);
  var $container = $("#table-body"), htmlStr = "";
  res.data.orderList.map(function (item) {
    htmlStr += tpl.tableCell.render(item);
  });
  !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
  $container.html(htmlStr);
  if (res.total > Data.getListParams.pageSize) {
    func.createPagination(res.total, Data.getListParams.pageSize, Data.getListParams.page, function (page) {
      Data.getListParams.page = page;
      api.getList(Data.getListParams, function (res) {
        func.renderList(res);
      });
    });
  } else {
    $("#pagination-container").html("");
  }
};
func.createPagination = function (totalCount, pageSize, currentPage, callback) {
  var totalPages = Math.ceil(totalCount / pageSize), pagination = new Pagination($("#pagination-container"), {
    onChange: function (pageToChange) {
      callback(pageToChange - 1);
    },
    showDesc: !1,
    showGoTo: !1,
    currentPage: currentPage + 1,
    totalPages: totalPages,
    totalCount: totalCount,
    perPage: pageSize
  });
  pagination.render();
};
func.renderTag = function (res) {
  var $ctnr = $("#tag-ctnr"), htmlStr = "";
  res.data.map(function (item) {
    htmlStr += tpl.tagCell.render(item);
  });
  !htmlStr && (htmlStr = tpl.noTagCell.render({}));
  $ctnr.html(htmlStr);
};
func.renderUserInfoCtnr = function (res) {
  var $container = $("#merit-info-ctnr"), htmlStr = "";
  res.data.map(function (item, index, arr) {
    htmlStr += tpl.userDetail.render(item);
    if (index !== arr.length - 1) {
      htmlStr += "<hr>";
    }
  });
  !htmlStr && (htmlStr = tpl.userDetailEmpty.render({}));
  $container.html(htmlStr);
};
func.renderTagSelect = function (handleData) {
  var $select = $("[data-ele=\"tag-select\"]"), htmlStr = "";
  Object.keys(handleData).map(function (id) {
    htmlStr += tpl.selectOption.render(handleData[id]);
  });
  $select.html(htmlStr);
  $select.selectpicker("refresh");
};
func.renderBuddhistDetlModal = function (res) {
  var $ctnr = $("#buddhist-popup-cont"), htmlStr = tpl.BuddhistOrderDetl.render(res.data);
  $ctnr.html(htmlStr);
  var $qrCodeContainer = $("#buddhist-popup-qr-code");
  $qrCodeContainer.html("");
  new QRCode($qrCodeContainer[0], {
    text: res.data.qrcode,
    width: 100,
    height: 100
  });
  var feedImages = res.data.dispose_pic_url && res.data.dispose_pic_url.split(",");
  var $imageContainer = $("#buddhist-popup-feed-images");
  $imageContainer.html("");
  if (feedImages) {
    feedImages.map(function (image) {
      $imageContainer.append(tpl.imgCell.render({
        image: image
      }));
    });
  } else {
    $imageContainer.html("无");
  }
  if (res.data.remark) {
    $("#buddhist-popup-memo").html(res.data.remark);
  } else {
    $("#buddhist-popup-memo").html("无");
  }
  $("body").addClass("overflow-hidden");
  $("#buddhist-popup").show().scrollTop(0);
};
func.renderWallDetlModal = function (res) {
  $("#wall-popup-title").text(res.data.name + " " + res.data.place);
  $("#wall-popup-sequence").text(res.data.sequence);
  $("#wall-popup-time").text(res.data.time);
  $("#wall-popup-money").text(res.data.money);
  $("#wall-popup-type").text(res.data.type);
  $("#wall-popup-order-number").text(res.data.orderNumber);
  $("#wall-popup-flow-number").text(res.data.flowNumber);
  var $qrCodeContainer = $("#wall-popup-qr-code");
  $qrCodeContainer.html("");
  new QRCode($qrCodeContainer[0], {
    text: res.data.url,
    width: 100,
    height: 100
  });
  var $writeName = $("#wall-popup-write-name");
  var $writeNameContainer = $writeName.parent();
  if (res.data.writeName) {
    $writeNameContainer.removeClass("hide");
    $writeName.text(res.data.writeName);
  } else {
    $writeNameContainer.addClass("hide");
  }
  var $yangSahngRen = $("#wall-popup-yang-shang-ren");
  var $yangSahngRenContainer = $yangSahngRen.parent();
  if (res.data.yangShangRen) {
    $yangSahngRenContainer.removeClass("hide");
    $yangSahngRen.text(res.data.yangShangRen);
  } else {
    $yangSahngRenContainer.addClass("hide");
  }
  var $wangShengZhe = $("#wall-popup-wang-sheng-zhe");
  var $wangShengZheContainer = $wangShengZhe.parent();
  if (res.data.wangShengZhe) {
    $wangShengZheContainer.removeClass("hide");
    $wangShengZhe.text(res.data.wangShengZhe);
  } else {
    $wangShengZheContainer.addClass("hide");
  }
  var $wish = $("#wall-popup-wish");
  var $wishContainer = $wish.parent();
  if (res.data.wish) {
    $wishContainer.removeClass("hide");
    $wish.text(res.data.wish);
  } else {
    $wishContainer.addClass("hide");
  }
  var feedImages = res.data.feedImage && res.data.feedImage.split(",");
  var $imageContainer = $("#wall-popup-feed-images");
  $imageContainer.html("");
  if (feedImages) {
    feedImages.map(function (image) {
      $imageContainer.append(tpl.imgCell.render({
        image: image
      }));
    });
  }
  var $contact = $("#wall-popup-contact");
  $contact.html("");
  res.data.contactList && res.data.contactList.length && res.data.contactList.map(function (item) {
    $contact.append(tpl.contactCell.render(item));
  });
  if (res.data.memo) {
    $("#wall-popup-memo").html(res.data.memo);
  } else {
    $("#wall-popup-memo").html("无");
  }
  $("body").addClass("overflow-hidden");
  $("#wall-popup").show().scrollTop(0);
};
export default func;
