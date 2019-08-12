import $ from "jquery";
import indexData from "../data";
import commonTpl from "../tpl/common";
import swipeTpl from "../tpl/swipe_list";
import func from "../function";
import "jquery-confirm";
function postHandleForSwipeList($displayComponent, $editContainer, data) {
  var id = data.id, $displaySourceButtons = $editContainer.find("[data-swipe-list-display-source][data-type=\"" + data.sourceCategory + "\"]"), swiperWrapperInnerHtml = "", swiperWrapperInnerHtmlIndex1ForBuddhist = "", swiperWrapperInnerHtmlIndex1ForArticle = "", sourceBuddhistSubCategoryData = void 0, sourceArticleSubCategoryData = void 0, $addEl = $editContainer.find("[data-select-article-container][data-type=\"" + data.sourceCategory + "\"]"), $subTypeButtons = $editContainer.find("[data-swipe-list-sub-type]");
  $displayComponent.find("[data-swipe-list-title-display]").text(data.title);
  $editContainer.find("[data-swipe-list-title]").val(data.title);
  if (data.sourceCategory == 2) {
    $displayComponent.find("[data-swipe-list-body-parent][data-type=\"2\"]").show();
    $displayComponent.find("[data-swipe-list-body-parent][data-type=\"1\"]").hide();
    $editContainer.find("[data-swipe-list-edit-types-container][data-type=\"2\"]").show();
    $editContainer.find("[data-swipe-list-edit-types-container][data-type=\"1\"]").hide();
    $editContainer.find("[data-swipe-list-source-category]").val(2);
  }
  if (data.displaySource == 1) {
    $displayComponent.find("[data-swipe-list-body][data-type=\"" + data.sourceCategory + "\"][data-index=\"1\"]").show();
    $displayComponent.find("[data-swipe-list-body][data-type=\"" + data.sourceCategory + "\"][data-index=\"2\"]").hide();
    $($displaySourceButtons[0]).prop({
      checked: !0
    });
    $editContainer.find("[data-swipe-list-tab-container][data-type=\"" + data.sourceCategory + "\"][data-index=\"1\"]").show();
    $editContainer.find("[data-swipe-list-tab-container][data-type=\"" + data.sourceCategory + "\"][data-index=\"2\"]").hide();
  } else {
    $displayComponent.find("[data-swipe-list-body][data-type=\"" + data.sourceCategory + "\"][data-index=\"1\"]").hide();
    $displayComponent.find("[data-swipe-list-body][data-type=\"" + data.sourceCategory + "\"][data-index=\"2\"]").show();
    $($displaySourceButtons[1]).prop({
      checked: !0
    });
    $editContainer.find("[data-swipe-list-tab-container][data-type=\"" + data.sourceCategory + "\"][data-index=\"1\"]").hide();
    $editContainer.find("[data-swipe-list-tab-container][data-type=\"" + data.sourceCategory + "\"][data-index=\"2\"]").show();
  }
  if (data.sourceCategory == 1) {
    $editContainer.find("[data-swipe-list-source-sub-category][data-type=\"1\"]").val(data.buddhistCategory);
  } else {
    $editContainer.find("[data-swipe-list-source-sub-category][data-type=\"2\"]").val(data.articleCategory);
  }
  indexData.misc.buddhistTypes.map(function (item) {
    if (item.id == data.buddhistCategory) {
      sourceBuddhistSubCategoryData = item;
      return !1;
    }
  });
  indexData.misc.articleTypes.map(function (item) {
    if (item.id == data.articleCategory) {
      sourceArticleSubCategoryData = item;
      return !1;
    }
  });
  !!sourceBuddhistSubCategoryData && (sourceBuddhistSubCategoryData.images.map(function (item) {
    var newItem = {
      componentId: id,
      image: item.url,
      content: item.name,
      status: item.status,
      type: 1
    };
    (newItem.image = newItem.image.slice(0, newItem.image.indexOf("?")) + indexData.imagesParams[3][data.subType - 1], swiperWrapperInnerHtmlIndex1ForBuddhist += swipeTpl.displayImageCellIndex1.render(newItem));
  }), $displayComponent.find("[data-swipe-list-swiper-wrapper][data-index=\"1\"][data-type=\"1\"]").html(swiperWrapperInnerHtmlIndex1ForBuddhist));
  !!sourceArticleSubCategoryData && (sourceArticleSubCategoryData.images.map(function (item) {
    var newItem = {
      componentId: id,
      image: item.url,
      content: item.name,
      status: item.status,
      type: 2
    };
    (newItem.image = newItem.image.slice(0, newItem.image.indexOf("?")) + indexData.imagesParams[3][data.subType - 1], swiperWrapperInnerHtmlIndex1ForArticle += swipeTpl.displayImageCellIndex1.render(newItem));
  }), $displayComponent.find("[data-swipe-list-swiper-wrapper][data-index=\"1\"][data-type=\"2\"]").html(swiperWrapperInnerHtmlIndex1ForArticle));
  $editContainer.find("[data-swipe-list-items-count]").val(data.itemsCount);
  data.images.map(function (item) {
    var newItem = {
      imageId: data.sourceCategory == 1 ? item.id : item.articleId,
      image: item.url,
      content: item.content,
      componentId: id,
      status: item.status,
      sourceType: data.sourceCategory
    };
    $addEl.before(swipeTpl.editSelectedCell.render(newItem));
    (newItem.image = newItem.image.slice(0, newItem.image.indexOf("?")) + indexData.imagesParams[3][data.subType - 1], swiperWrapperInnerHtml += swipeTpl.displayImageCell.render(newItem));
  });
  $displayComponent.find("[data-swipe-list-swiper-wrapper][data-index=\"2\"][data-type=\"" + data.sourceCategory + "\"]").html(swiperWrapperInnerHtml);
  $displayComponent.find("[data-swipe-list-body]").addClass(indexData.swipeListBodyClasses[data.subType - 1]);
  $($subTypeButtons[data.subType - 1]).prop({
    checked: !0
  });
  const $titleContainer = $displayComponent.find("[data-swipe-list-title-container]");
  data.showTitle ? $titleContainer.show() : $titleContainer.hide();
  const $moreContainer = $displayComponent.find("[data-swipe-list-more]");
  data.showMore ? $moreContainer.show() : $moreContainer.hide();
  $editContainer.find("[data-swipe-list-show-title]").prop({
    checked: !!data.showTitle
  });
  $editContainer.find("[data-swipe-list-show-more]").prop({
    checked: !!data.showMore
  });
  $displayComponent.find("[data-swipe-list-cell][data-index=\"1\"][data-type=\"1\"]").map(function (index) {
    index < data.itemsCount ? $(this).css({
      display: "inline-block"
    }) : $(this).hide();
  });
  $displayComponent.find("[data-swipe-list-cell][data-index=\"2\"][data-type=\"1\"]").map(function (index) {
    index < data.itemsCount ? $(this).css({
      display: "inline-block"
    }) : $(this).hide();
  });
  $displayComponent.find("[data-swipe-list-cell][data-index=\"1\"][data-type=\"2\"]").map(function (index) {
    index < data.itemsCount ? $(this).css({
      display: "inline-block"
    }) : $(this).hide();
  });
  $displayComponent.find("[data-swipe-list-cell][data-index=\"2\"][data-type=\"2\"]").map(function (index) {
    index < data.itemsCount ? $(this).css({
      display: "inline-block"
    }) : $(this).hide();
  });
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
}
export default postHandleForSwipeList;
