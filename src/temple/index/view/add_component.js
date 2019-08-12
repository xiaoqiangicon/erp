import $ from "jquery";
import clone from "clone";
import indexData from "../data";
import indexFeastBirthFunc from "../feast_birth_func";
import sample from "../components_sample";
import introTpl from "../tpl/introduction";
import personTpl from "../tpl/person_saying";
import swipeTpl from "../tpl/swipe_list";
import donateTpl from "../tpl/donate_chart";
import calendarTpl from "../tpl/calendar";
import shortcutTpl from "../tpl/shortcut";
import houseTpl from "../tpl/house";
import func from "../function";
import share from "../share";
import figureUtil from "./figure/util";
import houseUtil from "./house/util";
import "lib/bootstrap-material-datetimepicker";
import "jquery-confirm";
import "lib/jquery.seeView";
import "../ajax";
var tpls = [introTpl, personTpl, swipeTpl, donateTpl, calendarTpl, shortcutTpl, houseTpl];
$.seeView({
  events: {
    "click [data-action=\"component-add\"]": "onClickComponentAdd"
  },
  onClickComponentAdd: function (e) {
    var self = this, $this = $(e.target), type = parseInt($this.attr("data-type").trim()), insert = parseInt($this.attr("data-insert").trim()), $activeDisplayComponent = $("[data-container=\"component-display\"].active"), $displayContainer = $("#components-display-container"), $editContainer = $("#components-edit-container"), $editContainerParent = $("#design-sidebar"), $displayComponent, $editComponent, componentName = sample.components[type - 1].name, initializeComponentData = clone(sample.componentDisplaySample[componentName]);
    var availableInfo = self.checkComponentAvailableToAdd(type);
    if (!availableInfo.available) {
      $.alert({
        title: false,
        content: availableInfo.message,
        buttons: {
          ok: {
            text: "确定"
          }
        },
        theme: "white"
      });
      return !1;
    }
    var currentComponentId = indexData.misc.componentCount[type + ""]++;
    initializeComponentData.id = currentComponentId;
    initializeComponentData.isUpdate = 0;
    initializeComponentData.sortId = 0;
    if (type === 2) {
      share.figureComponent = {
        components: []
      };
    } else if (type === 5) {
      initializeComponentData.monthData = indexFeastBirthFunc.getCurrentMonthCalendarData();
      indexFeastBirthFunc.assignCurrentDateToComponent(initializeComponentData);
      initializeComponentData.currentDay = indexData.today.day;
      initializeComponentData.currentMonth = indexData.today.month;
      initializeComponentData.currentWeekDay = indexData.weekdays[indexData.today.weekDay];
    } else if (type === 7) {
      share.houseComponent = {
        houses: []
      };
    }
    $displayComponent = $(tpls[type - 1].display.render(initializeComponentData));
    $displayComponent.addClass("active");
    insert && $activeDisplayComponent.length ? $activeDisplayComponent.removeClass("active").after($displayComponent) : ($displayContainer.append($displayComponent), $displayComponent.siblings().removeClass("active"));
    var editComponentData = {
      id: currentComponentId,
      fileMark: $.seeAjax.getEnv() === 2 ? "files[]" : "file",
      isUpdate: 0,
      sortId: 0
    };
    if (type === 3) {
      editComponentData.buddhistTypes = indexData.misc.buddhistTypes;
      editComponentData.articleTypes = indexData.misc.articleTypes;
    } else if (type === 7) {
      editComponentData.title = "殿堂场景";
    }
    $editComponent = $(tpls[type - 1].edit.render(editComponentData));
    $editContainer.append($editComponent);
    $editComponent.siblings().hide();
    $editContainerParent.css({
      "margin-top": $displayComponent.position().top + 64
    }).show();
    self.postHandleAfterComponentAdded($editComponent, type, currentComponentId);
  },
  checkComponentAvailableToAdd: function (type) {
    var messages = ["寺院简介组件最多只能添加一个", "高僧法师组件最多只能添加一个", "图文组件最多只能添加一个", "功德榜组件最多只能添加一个", "佛历组件最多只能添加一个", "", "殿堂场景组件最多只能添加一个"];
    switch (type) {
      case 1:
      case 2:
      case 4:
      case 5:
      case 7:
        if (!!$("[data-container=\"component-display\"][data-type=\"" + type + "\"]").length) return {
          available: !1,
          message: messages[type - 1]
        };
    }
    return {
      available: !0
    };
  },
  postHandleAfterComponentAdded: function ($editContainer, type, id) {
    var self = this;
    switch (type) {
      case 1:
        self.postHandleAfterComponentAddedForIntroduction($editContainer, id);
        break;
      case 2:
        self.postHandleAfterComponentAddedForPersonSaying($editContainer, id);
        break;
      case 3:
        self.postHandleAfterComponentAddedForSwipeList($editContainer, id);
        break;
      case 4:
        self.postHandleAfterComponentAddedForDonateChart($editContainer, id);
        break;
      case 5:
        self.postHandleAfterComponentAddedForCalendar($editContainer, id);
        break;
      case 6:
        self.postHandleAfterComponentAddedForShortcut($editContainer, id);
        break;
      case 7:
        self.postHandleAfterComponentAddedForHouse($editContainer, id);
        break;
      default:
        break;
    }
  },
  postHandleAfterComponentAddedForIntroduction: function ($editContainer, id) {
    var self = this;
    $editContainer.find("[data-place-picker]").distpicker();
    $editContainer.find("[data-introduction-images-container]").sortable({
      items: "li:not([data-file-upload-container])",
      stop: function (e) {
        var $introductionWrapper = $("[data-introduction-swiper-wrapper]"), $imageContainers = $("[data-upload-image-container][data-type=\"1\"]"), items = [];
        $imageContainers.map(function () {
          var $this = $(this), isUpdate = parseInt($this.attr("data-is-update")), imageId = parseInt($this.attr("data-image-id")), src = $this.find("img").attr("src");
          items.push({
            id: id,
            image: src,
            imageId: imageId,
            type: 1,
            isUpdate: isUpdate
          });
        });
        $introductionWrapper.html("");
        items.map(function (item) {
          $introductionWrapper.append(introTpl.displayImageCell.render(item));
        });
      }
    });
  },
  postHandleAfterComponentAddedForPersonSaying: function ($editContainer, id) {
    $editContainer.find("[data-edit-com-figure-body]").sortable({
      stop: function (e) {
        figureUtil.afterSortable();
      }
    });
  },
  postHandleAfterComponentAddedForSwipeList: function ($editContainer, id) {
    var swiperWrapperInnerHtmlIndex1ForBuddhist = "", swiperWrapperInnerHtmlIndex1ForArticle = "", sourceBuddhistSubCategoryData = void 0, sourceArticleSubCategoryData = void 0;
    indexData.misc.buddhistTypes.map(function (item) {
      if (item.id == 0) {
        sourceBuddhistSubCategoryData = item;
        return !1;
      }
    });
    indexData.misc.articleTypes.map(function (item) {
      if (item.id == 0) {
        sourceArticleSubCategoryData = item;
        return !1;
      }
    });
    !!sourceBuddhistSubCategoryData && (sourceBuddhistSubCategoryData.images.map(function (item) {
      swiperWrapperInnerHtmlIndex1ForBuddhist += swipeTpl.displayImageCellIndex1.render({
        componentId: id,
        image: item.url,
        content: item.name,
        status: item.status,
        type: 1
      });
    }), $("[data-swipe-list-swiper-wrapper=\"" + id + "\"][data-index=\"1\"][data-type=\"1\"]").html(swiperWrapperInnerHtmlIndex1ForBuddhist));
    !!sourceArticleSubCategoryData && (sourceArticleSubCategoryData.images.map(function (item) {
      swiperWrapperInnerHtmlIndex1ForArticle += swipeTpl.displayImageCellIndex1.render({
        componentId: id,
        image: item.url,
        content: item.name,
        status: item.status,
        type: 2
      });
    }), $("[data-swipe-list-swiper-wrapper=\"" + id + "\"][data-index=\"1\"][data-type=\"2\"]").html(swiperWrapperInnerHtmlIndex1ForArticle));
    $editContainer.find("[data-swipe-list-images-container]").sortable({
      items: "li:not([data-select-article-container])",
      stop: function (e) {
        var $this = $(e.target), type = parseInt($this.attr("data-type")), $swiperListWrapper = $("[data-swipe-list-swiper-wrapper=\"" + id + "\"]" + "[data-type=\"" + type + "\"][data-index=\"2\"]"), $imageContainers = $("[data-upload-image-container][data-type=\"3\"][data-source-type=\"" + type + "\"][data-component-id=\"" + id + "\"]"), items = [];
        var componentSubType = parseInt($("[data-swipe-list-sub-type=\"" + id + "\"]:checked").val());
        $imageContainers.map(function () {
          var $this = $(this), imageId = parseInt($this.attr("data-upload-image-container"));
          items.push({
            componentId: id,
            imageId: imageId,
            image: $this.attr("data-image"),
            content: $this.attr("data-content"),
            status: parseInt($this.attr("data-status")),
            sourceType: type
          });
        });
        $swiperListWrapper.html("");
        items.map(function (item) {
          (item.image = item.image.slice(0, item.image.indexOf("?")) + indexData.imagesParams[3][componentSubType - 1], $swiperListWrapper.append(swipeTpl.displayImageCell.render(item)));
        });
        func.reshowSwipeList(id, type, 2);
      }
    });
  },
  postHandleAfterComponentAddedForDonateChart: function ($editContainer, id) {},
  postHandleAfterComponentAddedForCalendar: function ($editContainer, id) {},
  postHandleAfterComponentAddedForShortcut: function ($editContainer, id) {
    $editContainer.find("[data-shortcut-images-container]").sortable({
      items: "li:not([data-edit-shortcut-add])",
      stop: function (e) {
        var $shortcutBody = $("[data-display-shortcut-body=\"" + id + "\"]"), $shortcutCells = $("[data-edit-shortcut-cell=\"" + id + "\"]"), items = [];
        $shortcutCells.map(function () {
          var $this = $(this), title = $this.attr("data-title"), image = $this.attr("data-image"), link = $this.attr("data-link");
          items.push({
            title: title,
            image: image,
            link: link
          });
        });
        $shortcutBody.html("");
        items.map(function (item) {
          $shortcutBody.append(shortcutTpl.displayCell.render(item));
        });
      }
    });
  },
  postHandleAfterComponentAddedForHouse: function ($editContainer, id) {
    $editContainer.find("[data-edit-com-house-body]").sortable({
      stop: function (e) {
        houseUtil.afterSortable();
      }
    });
  }
});
