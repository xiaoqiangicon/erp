import $ from "jquery";
import commonFunc from "common/function";
import data from "./data";
import tpl from "./tpl";
import Clipboard from "clipboard";
import "./ajax";
import "bootstrap-select";
var func = {};
func.init = function () {
  $("#loading-toast").addClass("hide");
  new Clipboard(".copy-link");
  $(".select-picker").selectpicker("refresh");
  func.getTempleSet({}, function (res) {
    func.renderTempleSet(res);
  });
};
func.getTempleSet = function (params, callback) {
  $.seeAjax.get("getTempleSet", params, function (res) {
    if (res.success) {
      data.templeSetRes = res;
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.renderTempleSet = function (res) {
  $("#wx-link").val(res.url);
  $("#qrcode-container").qrcode({
    width: 500,
    height: 500,
    text: res.url
  });
  res.giftList.map(function (item) {
    $("[data-input-day-type=" + item.type + "]").val(item.content);
    $("[data-select-day-type=" + item.type + "]").val(item.formType).selectpicker("refresh");
  });
  if (typeof res.freeNumber !== "undefined" && res.freeNumber !== -1) {
    $("#free-incense-limit").prop("checked", true);
    $("#limit-num").val(res.freeNumber);
  } else {
    $("#free-incense-not-limit").prop("checked", true);
  }
  func.renderMusicList(res.musicList);
};
func.renderMusicList = function (data) {
  var $container = $("#music-list-container"), htmlStr = "";
  data.map(function (item) {
    htmlStr += tpl.musicCell.render(item);
  });
  $container.html(htmlStr);
};
func.updateTempleSet = function (params, callback) {
  $.seeAjax.post("updateTempleSet", params, function (res) {
    params.giftList = JSON.stringify(params.giftList);
    if (res.success) {
      params.giftList = JSON.parse(params.giftList);
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  }, true);
};
export default func;
