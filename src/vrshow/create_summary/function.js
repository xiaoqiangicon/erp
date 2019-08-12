import $ from "jquery";
import Toast from "old/toast";
import commonFunc from "common/function";
import commonVars from "common/variables";
import data from "./data";
import tpl from "./tpl";
import uploadFile from "common/upload_file";
import "./ajax";
import "bootstrap-select";
var func = {};
func.init = function () {
  $("#loading-toast").addClass("hide");
  var $navBarTitle = $("[data-ele=\"nav-bar-title\"]"), id = commonVars.params.id;
  uploadFile($("[data-ele=\"sound-input-file\"]"), {
    maxFileSize: 1 * 1024 * 1024,
    messages: {
      maxFileSize: "请上传大小不超过1M的音频"
    }
  }, function (url) {
    var $addSound = $("[data-ele=\"add-sound\"]"), $addSoundContainer = $("[data-ele=\"add-sound-container\"]"), $audioContainer = $("[data-ele=\"audio-container\"]"), $audio = $("[data-ele=\"audio\"]"), $submit = $("#submit");
    $addSound.removeClass("background-loading");
    Toast("上传成功", 1, 2000, false);
    $audio.prop("src", url);
    $addSoundContainer.hide();
    $audioContainer.show();
    $submit.prop("disabled", false);
  }, function (e, data) {
    var $addSound = $("[data-ele=\"add-sound\"]"), $submit = $("#submit");
    $addSound.addClass("background-loading");
    $submit.prop("disabled", true);
  });
  if (typeof id !== "undefined") {
    data.getSceneParams.type = 2;
    func.getSceneSet({
      sceneId: id
    }, function (res) {
      func.renderOneSceneSelect(res.data);
      $navBarTitle.html("编辑简介");
      func.renderSet(res.data);
    });
  } else {
    data.getSceneParams.type = 3;
    func.getScene(data.getSceneParams, function (res) {
      func.renderSceneSelect(res);
    });
  }
};
func.getScene = function (params, callback) {
  $.seeAjax.get("getScene", params, function (res) {
    if (res.success) {
      res.data.map(function (item) {
        data.getSceneData[item.sceneId] = item;
      });
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.renderSceneSelect = function (res) {
  var $container = $("#scene"), htmlStr = "";
  if (res.data.length) {
    res.data.map(function (item) {
      htmlStr += tpl.sceneSelect.render(item);
    });
  } else {
    htmlStr = "<option>暂无可选场景</option>>";
  }
  $container.html(htmlStr);
  $container.selectpicker("refresh");
};
func.renderOneSceneSelect = function (d) {
  var $container = $("#scene"), htmlStr = "";
  htmlStr = tpl.sceneSelect.render({
    sceneId: d.sceneId,
    sceneName: d.sceneName
  });
  $container.html(htmlStr);
  $container.selectpicker("refresh");
};
func.getSceneSet = function (params, callback) {
  $.seeAjax.get("getSceneSet", params, function (res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
func.renderSet = function (d) {
  var $scene = $("#scene"), $summary = $("#summary"), $numTip = $summary.next(), number = d.summary.length, total = parseInt($numTip.html().match(/\/(\d+)/)[1]), $imgContainer = $("[data-ele=\"img-container\"]"), $imgCellContainer = $("[data-ele=\"img-cell-container\"]"), $addImg = $("[data-ele=\"add-img\"]"), $addSoundContainer = $("[data-ele=\"add-sound-container\"]"), $audioContainer = $("[data-ele=\"audio-container\"]"), $audio = $("[data-ele=\"audio\"]");
  $scene.prop("disabled", true);
  $scene.val(d.sceneId).selectpicker("refresh");
  $summary.html(d.summary);
  $summary.next().addClass("color-dd524d");
  $numTip.html(number + "/" + total);
  if (!!d.pic) {
    var newAry = [], htmlStr = "";
    newAry = d.pic.split(",");
    newAry.map(function (item) {
      data.imgData.push({
        src: item
      });
      htmlStr += tpl.imgCell.render({
        src: item
      });
    });
    $imgContainer.addClass("has-img");
    $imgCellContainer.html(htmlStr);
    if (data.imgData.length === 5) {
      $addImg.hide();
    }
  }
  if (!!d.sound) {
    $addSoundContainer.hide();
    $audio.prop("src", d.sound);
    $audioContainer.show();
  }
};
func.updateSet = function (params, callback) {
  $.seeAjax.post("updateSet", params, function (res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
export default func;
