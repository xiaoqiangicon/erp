import $ from "jquery";
import Toast from "old/toast";
import data from "./data";
import tpl from "./tpl";
import func from "./function";
import "./ajax";
import "jquery-confirm";
import "lib/jquery.seeView";
$.seeView({
  events: {
    "click #add-watchword-btn": "onClickAddWatchwordBtn",
    "keyup #watchword": "textNumTip",
    "click #submit-watchword": "submitWatchword",
    "click [data-opt=\"editor\"]": "onClickOptionEditor",
    "click [data-opt=\"visibility\"]": "onClickOptionVisibility",
    "click [data-opt=\"delete\"]": "onClickOptionDelete"
  },
  onClickAddWatchwordBtn: function (e) {
    data.updateWatchwordParams.id = 0;
    var $modal = $("#add-watchword-modal"), $buddhistName = $modal.find(".buddhist-name"), $watchword = $modal.find(".watchword-textarea"), $textNum = $modal.find(".textarea-num");
    $buddhistName.val("");
    $watchword.val("");
    $textNum.html("0/70");
    $modal.find(".modal-title").html("添加字幕");
    $modal.modal("show");
  },
  textNumTip: function (e) {
    var length = $("#watchword").val().length;
    $(".textarea-num").html(length + "/70");
  },
  submitWatchword: function (e) {
    var $modal = $("#add-watchword-modal"), $buddhistName = $modal.find(".buddhist-name"), $watchword = $modal.find(".watchword-textarea"), name = $buddhistName.val(), content = $watchword.val();
    if (name === "") {
      Toast("请填写法师称谓", 2, 3000, false);
      return;
    }
    if (content === "") {
      Toast("请填写字幕内容", 2, 3000, false);
      return;
    }
    data.updateWatchwordParams.name = name;
    data.updateWatchwordParams.content = content;
    func.updateWatchword(data.updateWatchwordParams, function (res) {
      if (data.updateWatchwordParams.id === 0) {
        Toast("添加成功", 1, 3000, false);
        func.getList({}, function (res) {
          func.renderList(res);
        });
      } else {
        Toast("编辑成功", 1, 3000, false);
        var curTr = $(".table-cell-" + data.updateWatchwordParams.id), status = parseInt(curTr.find(".option-visibility").attr("data-status")), htmlStr = "";
        htmlStr = tpl.tableCell.render({
          id: data.updateWatchwordParams.id,
          status: status,
          name: name,
          content: content
        });
        curTr.replaceWith(htmlStr);
      }
      $modal.modal("hide");
    });
  },
  onClickOptionEditor: function (e) {
    var self = this, $tar = $(e.target), id = parseInt($tar.attr("data-id")), $modal = $("#add-watchword-modal"), $buddhistName = $modal.find(".buddhist-name"), $watchword = $modal.find(".watchword-textarea"), $textNum = $modal.find(".textarea-num"), curItem = {};
    data.updateWatchwordParams.id = id;
    data.getListRes.data.map(function (item) {
      if (item.id === id) {
        curItem = item;
      }
    });
    $buddhistName.val(curItem.name);
    $watchword.val(curItem.content);
    self.textNumTip();
    $modal.find(".modal-title").html("编辑字幕");
    $modal.modal("show");
  },
  onClickOptionVisibility: function (e) {
    var $tar = $(e.target), id = parseInt($tar.attr("data-id")), status = parseInt($tar.attr("data-status"));
    status === 0 ? status = 1 : status = 0;
    func.operateWatchword({
      id: id,
      status: status
    }, function (res) {
      if (status === 1) {
        $tar.html("显示");
      } else {
        $tar.html("隐藏");
      }
      $tar.attr("data-status", status);
    });
  },
  onClickOptionDelete: function (e) {
    var $tar = $(e.target), id = parseInt($tar.attr("data-id"));
    $.confirm({
      title: false,
      content: "你确定删除吗?",
      buttons: {
        ok: {
          text: "确定",
          action: function () {
            func.operateWatchword({
              id: id,
              status: -1
            }, function (res) {
              func.getList(data.getListParams, function (res) {
                func.renderList(res);
              });
            });
          }
        },
        cancel: {
          text: "取消",
          action: function () {}
        }
      }
    });
  }
});
