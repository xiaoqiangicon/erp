import $ from "jquery";
import ChooseImage from "../../../../../old-com/choose-image/src";
import commonFunc from "common/function";
import indexData from "../../data";
import commonTpl from "../../tpl/common";
import houseTpl from "../../tpl/house";
import dialog from "../../../../util/dialog";
import share from "../../share";
import util from "./util";
import "lib/jquery.seeView";
import "component/choose_icon_config/index";
var choose;
$.seeView({
  events: {
    "click [data-edit-pop-house-cover-row-del]": "clickCoverRowDel",
    "click #edit-pop-house-add-cover": "clickAddCover",
    "propertychange #edit-pop-house-input-intro": "changeInputIntro",
    "input #edit-pop-house-input-intro": "changeInputIntro",
    "click #edit-pop-house-ok": "clickOk"
  },
  clickCoverRowDel: function (e) {
    $(e.target).parent().remove();
  },
  clickAddCover: function (e) {
    if (!choose) {
      choose = new ChooseImage({
        multiSelect: !0,
        onSubmit: function (data) {
          var $addBox = $("#edit-pop-house-add-cover-box");
          data.forEach(function (item) {
            $addBox.before(houseTpl.coverRow.render({
              image: item.src
            }));
          });
        }
      });
    }
    choose.show();
  },
  changeInputIntro: function (e) {
    var $this = $(e.target);
    $("#edit-pop-house-input-intro-count").text($this.val().length);
  },
  clickOk: function () {
    var $images = $("[data-edit-pop-house-cover-row-image]");
    if (!$images.length) {
      dialog("照片不能为空");
      return;
    }
    var covers = [];
    $images.map(function () {
      var $this = $(this);
      covers.push($this.attr("src"));
    });
    var name = $("#edit-pop-house-input-name").val();
    var intro = $("#edit-pop-house-input-intro").val();
    if (!name) {
      dialog("殿堂名称不能为空");
      return;
    }
    if (!intro) {
      dialog("殿堂简介不能为空");
      return;
    }
    var formatCovers = covers.map(function (cover) {
      return cover.indexOf("?") < 0 ? cover + indexData.imagesParams[7][0] : cover;
    });
    if (share.editHouseId) {
      var editItem = share.houseComponent.houses.find(function (i) {
        return i.id === share.editHouseId;
      });
      editItem.covers = formatCovers;
      editItem.name = name;
      editItem.intro = intro;
    } else {
      var newId = 1;
      share.houseComponent.houses.forEach(function (i) {
        if (i.id >= newId) newId = i.id + 1;
      });
      share.houseComponent.houses.push({
        id: newId,
        newAdded: !0,
        covers: formatCovers,
        name: name,
        intro: intro
      });
    }
    util.render();
    $("#edit-pop-house").hide();
  }
});
