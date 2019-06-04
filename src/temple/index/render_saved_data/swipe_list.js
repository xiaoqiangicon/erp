/**
 * Created by senntyou on 2017/2/27.
 */

define([
  'jquery',
  '../data',
  '../tpl/common',
  '../tpl/swipe_list',
  '../function',
  'jquery-confirm',
], function($, indexData, commonTpl, swipeTpl, func) {
  // 添加图文列表组件后事件添加
  function postHandleForSwipeList($displayComponent, $editContainer, data) {
    var id = data.id,
      // 内容来源的按钮
      $displaySourceButtons = $editContainer.find(
        '[data-swipe-list-display-source][data-type="' +
          data.sourceCategory +
          '"]'
      ),
      // 展示组件图片html初始化字符串
      swiperWrapperInnerHtml = '',
      // 展示组件图片分类展示时html初始化字符串
      swiperWrapperInnerHtmlIndex1ForBuddhist = '',
      swiperWrapperInnerHtmlIndex1ForArticle = '',
      // 展示组件图片分类展示时从服务器返回的数据
      sourceBuddhistSubCategoryData = void 0,
      sourceArticleSubCategoryData = void 0,
      // 添加按钮
      $addEl = $editContainer.find(
        '[data-select-article-container][data-type="' +
          data.sourceCategory +
          '"]'
      ),
      // 子类型按钮
      $subTypeButtons = $editContainer.find('[data-swipe-list-sub-type]');

    // 更新标题到展示组件中
    $displayComponent.find('[data-swipe-list-title-display]').text(data.title);
    // 更新组件到编辑组件中
    $editContainer.find('[data-swipe-list-title]').val(data.title);

    // 更新内容来源到组件中
    // 文章
    if (data.sourceCategory == 2) {
      $displayComponent
        .find('[data-swipe-list-body-parent][data-type="2"]')
        .show();
      $displayComponent
        .find('[data-swipe-list-body-parent][data-type="1"]')
        .hide();

      $editContainer
        .find('[data-swipe-list-edit-types-container][data-type="2"]')
        .show();
      $editContainer
        .find('[data-swipe-list-edit-types-container][data-type="1"]')
        .hide();

      $editContainer.find('[data-swipe-list-source-category]').val(2);
    }
    // 分类显示
    if (data.displaySource == 1) {
      // 展示组件
      $displayComponent
        .find(
          '[data-swipe-list-body][data-type="' +
            data.sourceCategory +
            '"][data-index="1"]'
        )
        .show();
      $displayComponent
        .find(
          '[data-swipe-list-body][data-type="' +
            data.sourceCategory +
            '"][data-index="2"]'
        )
        .hide();

      // 编辑组件
      $($displaySourceButtons[0]).prop({
        checked: !0,
      });
      $editContainer
        .find(
          '[data-swipe-list-tab-container][data-type="' +
            data.sourceCategory +
            '"][data-index="1"]'
        )
        .show();
      $editContainer
        .find(
          '[data-swipe-list-tab-container][data-type="' +
            data.sourceCategory +
            '"][data-index="2"]'
        )
        .hide();
    }
    // 指定条目
    else {
      // 展示组件
      $displayComponent
        .find(
          '[data-swipe-list-body][data-type="' +
            data.sourceCategory +
            '"][data-index="1"]'
        )
        .hide();
      $displayComponent
        .find(
          '[data-swipe-list-body][data-type="' +
            data.sourceCategory +
            '"][data-index="2"]'
        )
        .show();

      // 编辑组件
      $($displaySourceButtons[1]).prop({
        checked: !0,
      });
      $editContainer
        .find(
          '[data-swipe-list-tab-container][data-type="' +
            data.sourceCategory +
            '"][data-index="1"]'
        )
        .hide();
      $editContainer
        .find(
          '[data-swipe-list-tab-container][data-type="' +
            data.sourceCategory +
            '"][data-index="2"]'
        )
        .show();

      //$('[data-swipe-list-items-count-container="' + id + '"]').hide();
    }

    // 更新内容来源子内容
    if (data.sourceCategory == 1) {
      $editContainer
        .find('[data-swipe-list-source-sub-category][data-type="1"]')
        .val(data.buddhistCategory);
    } else {
      $editContainer
        .find('[data-swipe-list-source-sub-category][data-type="2"]')
        .val(data.articleCategory);
    }
    // 更新内容来源子内容展示组件的展示
    // 先找到数据
    indexData.misc.buddhistTypes.map(function(item) {
      if (item.id == data.buddhistCategory) {
        sourceBuddhistSubCategoryData = item;
        return !1;
      }
    });
    // 先找到数据
    indexData.misc.articleTypes.map(function(item) {
      if (item.id == data.articleCategory) {
        sourceArticleSubCategoryData = item;
        return !1;
      }
    });

    !!sourceBuddhistSubCategoryData &&
      (sourceBuddhistSubCategoryData.images.map(function(item) {
        var newItem = {
          componentId: id,
          image: item.url,
          content: item.name,
          status: item.status,
          type: 1,
        };
        // 更换图片尺寸
        (newItem.image =
          newItem.image.slice(0, newItem.image.indexOf('?')) +
          indexData.imagesParams[3][data.subType - 1]),
          (swiperWrapperInnerHtmlIndex1ForBuddhist += swipeTpl.displayImageCellIndex1.render(
            newItem
          ));
      }),
      $displayComponent
        .find('[data-swipe-list-swiper-wrapper][data-index="1"][data-type="1"]')
        .html(swiperWrapperInnerHtmlIndex1ForBuddhist));
    !!sourceArticleSubCategoryData &&
      (sourceArticleSubCategoryData.images.map(function(item) {
        var newItem = {
          componentId: id,
          image: item.url,
          content: item.name,
          status: item.status,
          type: 2,
        };
        // 更换图片尺寸
        (newItem.image =
          newItem.image.slice(0, newItem.image.indexOf('?')) +
          indexData.imagesParams[3][data.subType - 1]),
          (swiperWrapperInnerHtmlIndex1ForArticle += swipeTpl.displayImageCellIndex1.render(
            newItem
          ));
      }),
      $displayComponent
        .find('[data-swipe-list-swiper-wrapper][data-index="1"][data-type="2"]')
        .html(swiperWrapperInnerHtmlIndex1ForArticle));

    // 更新条数
    $editContainer.find('[data-swipe-list-items-count]').val(data.itemsCount);

    // 更新已选取的图片到展示组件中
    data.images.map(function(item) {
      var newItem = {
        imageId: data.sourceCategory == 1 ? item.id : item.articleId,
        image: item.url,
        content: item.content,
        componentId: id,
        status: item.status,
        sourceType: data.sourceCategory,
      };
      $addEl.before(swipeTpl.editSelectedCell.render(newItem));
      // 更换图片尺寸
      (newItem.image =
        newItem.image.slice(0, newItem.image.indexOf('?')) +
        indexData.imagesParams[3][data.subType - 1]),
        (swiperWrapperInnerHtml += swipeTpl.displayImageCell.render(newItem));
    });
    $displayComponent
      .find(
        '[data-swipe-list-swiper-wrapper][data-index="2"][data-type="' +
          data.sourceCategory +
          '"]'
      )
      .html(swiperWrapperInnerHtml);

    // 更新子类型到展示组件
    $displayComponent
      .find('[data-swipe-list-body]')
      .addClass(indexData.swipeListBodyClasses[data.subType - 1]);
    // 更新子类型到编辑组件
    $($subTypeButtons[data.subType - 1]).prop({
      checked: !0,
    });

    const $titleContainer = $displayComponent.find(
      '[data-swipe-list-title-container]'
    );
    data.showTitle ? $titleContainer.show() : $titleContainer.hide();
    const $moreContainer = $displayComponent.find('[data-swipe-list-more]');
    data.showMore ? $moreContainer.show() : $moreContainer.hide();
    // 更新是否展示标题到展示组件中

    // 更新是否展示标题到编辑组件中
    $editContainer.find('[data-swipe-list-show-title]').prop({
      checked: !!data.showTitle,
    });

    // 更新是否展示更多到编辑组件中
    $editContainer.find('[data-swipe-list-show-more]').prop({
      checked: !!data.showMore,
    });

    // 条数变化更新到展示组件
    $displayComponent
      .find('[data-swipe-list-cell][data-index="1"][data-type="1"]')
      .map(function(index) {
        index < data.itemsCount
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });
    $displayComponent
      .find('[data-swipe-list-cell][data-index="2"][data-type="1"]')
      .map(function(index) {
        index < data.itemsCount
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });
    $displayComponent
      .find('[data-swipe-list-cell][data-index="1"][data-type="2"]')
      .map(function(index) {
        index < data.itemsCount
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });
    $displayComponent
      .find('[data-swipe-list-cell][data-index="2"][data-type="2"]')
      .map(function(index) {
        index < data.itemsCount
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });

    // 图片列表启动排序
    $editContainer.find('[data-swipe-list-images-container]').sortable({
      items: 'li:not([data-select-article-container])',
      stop: function(e) {
        var $this = $(e.target),
          type = parseInt($this.attr('data-type')),
          $swiperListWrapper = $(
            '[data-swipe-list-swiper-wrapper="' +
              id +
              '"]' +
              '[data-type="' +
              type +
              '"][data-index="2"]'
          ),
          $imageContainers = $(
            '[data-upload-image-container][data-type="3"][data-source-type="' +
              type +
              '"][data-component-id="' +
              id +
              '"]'
          ),
          items = [];

        var componentSubType = parseInt(
          $('[data-swipe-list-sub-type="' + id + '"]:checked').val()
        );

        $imageContainers.map(function() {
          var $this = $(this),
            imageId = parseInt($this.attr('data-upload-image-container'));

          items.push({
            componentId: id,
            imageId: imageId,
            image: $this.attr('data-image'),
            content: $this.attr('data-content'),
            status: parseInt($this.attr('data-status')),
            sourceType: type,
          });
        });
        $swiperListWrapper.html('');
        items.map(function(item) {
          // 更换图片尺寸
          (item.image =
            item.image.slice(0, item.image.indexOf('?')) +
            indexData.imagesParams[3][componentSubType - 1]),
            $swiperListWrapper.append(swipeTpl.displayImageCell.render(item));
        });

        func.reshowSwipeList(id, type, 2);
      },
    });
  }

  return postHandleForSwipeList;
});
