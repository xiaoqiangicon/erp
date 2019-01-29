/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  '../../data',
  '../../tpl/common',
  '../../tpl/swipe_list',
  './util',
  'swiper',
  'jquery-confirm',
  'lib/jquery.seeView',
  '../../ajax',
], function($, indexData, commonTpl, swipeTpl, swipeListViewUtil) {
  $.seeView({
    events: {
      // 图文组件的标题
      'keyup [data-swipe-list-title]': 'onKeyUpInSwipeListTitle',
      // 图文组件点击显示标题
      'change [data-swipe-list-show-title]': 'onChangeSwipeListShowTitle',
      // 图文组件的条数
      'change [data-swipe-list-items-count]': 'onChangeInSwipeListItemsCount',
      // 图文组件子类型
      'change [data-swipe-list-sub-type]': 'onChangeSwipeListSubType',
      // 图文组件内容来源
      'change [data-swipe-list-source-category]':
        'onClickSwipeListSourceCategory',
      // 图文组件子内容来源
      'change [data-swipe-list-source-sub-category]':
        'onChangeSwipeListSourceSubCategory',
      // tab button切换
      'change [data-swipe-list-tab]': 'onSwipeListTabChange',
      // 点击添加文章
      'click [data-select-article]': 'onClickSelectArticle',
    },
    // 图文组件组件的标题
    onKeyUpInSwipeListTitle: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-swipe-list-title')),
        value = $this.val().trim();
      $('[data-swipe-list-title-display="' + id + '"]').text(value);
    },
    // 图文组件点击显示标题
    onChangeSwipeListShowTitle: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-swipe-list-show-title')),
        show = $this.prop('checked'),
        $container = $('[data-swipe-list-title-container="' + id + '"]');
      show ? $container.show() : $container.hide();
    },
    // 图文组件的条数
    onChangeInSwipeListItemsCount: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-swipe-list-items-count')),
        count = parseInt($this.val());

      $(
        '[data-swipe-list-cell="' + id + '"][data-type="1"][data-index="1"]'
      ).map(function(index) {
        index < count
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });
      $(
        '[data-swipe-list-cell="' + id + '"][data-type="1"][data-index="2"]'
      ).map(function(index) {
        index < count
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });
      $(
        '[data-swipe-list-cell="' + id + '"][data-type="2"][data-index="1"]'
      ).map(function(index) {
        index < count
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });
      $(
        '[data-swipe-list-cell="' + id + '"][data-type="2"][data-index="2"]'
      ).map(function(index) {
        index < count
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });
    },
    // 图文组件子类型
    onChangeSwipeListSubType: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-swipe-list-sub-type')),
        $checked = $('[data-swipe-list-sub-type="' + id + '"]:checked'),
        subType = parseInt($checked.val()),
        $container = $('[data-swipe-list-body="' + id + '"]'),
        $displayCells = $('[data-swipe-list-cell="' + id + '"]');

      // 横向排列
      if (subType == 1) {
        $container.removeClass('vertical two-columns vertical-small');
      }
      // 竖向排列
      else if (subType == 2) {
        $container.removeClass('two-columns');
        $container.removeClass('vertical-small');
        $container.addClass('vertical');
      }
      // 竖向双行排列
      else if (subType == 3) {
        $container.removeClass('vertical');
        $container.removeClass('vertical-small');
        $container.addClass('two-columns');
      }
      // 竖向小图排列
      else if (subType == 4) {
        $container.removeClass('vertical');
        $container.removeClass('two-columns');
        $container.addClass('vertical-small');
      }

      // 更改图片的尺寸
      $displayCells.map(function(index) {
        var $this = $(this),
          $img = $this.find('img'),
          url = !!$img.length && $img.attr('src'),
          urlWithoutParam = !!url && url.slice(0, url.indexOf('?'));
        !!$img.length &&
          $img.attr({
            src: urlWithoutParam + indexData.imagesParams[3][subType - 1],
          });
      });
    },
    // 图文组件内容来源
    onClickSwipeListSourceCategory: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-swipe-list-source-category')),
        categoryId = parseInt($this.val()),
        $displaySource = $(
          '[data-swipe-list-tab="' +
            id +
            '"][data-type="' +
            categoryId +
            '"]:checked'
        ),
        index = parseInt($displaySource.val()),
        $count = $('[data-swipe-list-items-count-container="' + id + '"]');

      $('[data-swipe-list-edit-types-container="' + id + '"]').hide();
      $(
        '[data-swipe-list-edit-types-container="' +
          id +
          '"][data-type="' +
          categoryId +
          '"]'
      ).show();
      $('[data-swipe-list-body-parent="' + id + '"]').hide();
      $(
        '[data-swipe-list-body-parent="' +
          id +
          '"][data-type="' +
          categoryId +
          '"]'
      ).show();

      //index == 1 ? $count.show() : $count.hide();
    },
    // 图文组件子内容来源
    onChangeSwipeListSourceSubCategory: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-swipe-list-source-sub-category')),
        type = parseInt($this.attr('data-type')),
        typeName = type == 1 ? 'buddhistTypes' : 'articleTypes',
        subCategoryId = parseInt($this.val()),
        swiperWrapperInnerHtmlIndex1 = '',
        sourceSubCategoryData = void 0,
        itemsCount;

      var componentSubType = parseInt(
        $('[data-swipe-list-sub-type="' + id + '"]:checked').val()
      );

      // 先找到数据
      indexData.misc[typeName].map(function(item) {
        if (item.id == subCategoryId) {
          sourceSubCategoryData = item;
          return !1;
        }
      });

      !!sourceSubCategoryData &&
        (sourceSubCategoryData.images.map(function(item) {
          swiperWrapperInnerHtmlIndex1 += swipeTpl.displayImageCellIndex1.render(
            {
              componentId: id,
              image:
                item.url.indexOf('?') != -1
                  ? item.url.slice(0, item.url.indexOf('?')) +
                    indexData.imagesParams[3][componentSubType - 1]
                  : item.url + indexData.imagesParams[3][componentSubType - 1],
              content: item.name,
              status: item.status,
              type: type,
            }
          );
        }),
        $(
          '[data-swipe-list-swiper-wrapper="' +
            id +
            '"][data-type="' +
            type +
            '"][data-index="1"]'
        ).html(swiperWrapperInnerHtmlIndex1));

      itemsCount = parseInt(
        $('[data-swipe-list-items-count="' + id + '"]').val()
      );

      $(
        '[data-swipe-list-cell="' +
          id +
          '"][data-type="' +
          type +
          '"][data-index="1"]'
      ).map(function(index) {
        index < itemsCount
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });
      $(
        '[data-swipe-list-cell="' +
          id +
          '"][data-type="' +
          type +
          '"][data-index="2"]'
      ).map(function(index) {
        index < itemsCount
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });
    },
    // 图文组件tab button切换
    onSwipeListTabChange: function(e) {
      var self = this,
        $tempThis = $(e.target),
        id = parseInt($tempThis.attr('data-swipe-list-tab')),
        type = parseInt($tempThis.attr('data-type')),
        $this = $(
          '[data-swipe-list-tab="' + id + '"][data-type="' + type + '"]:checked'
        ),
        index = parseInt($this.val()),
        $containers = $(
          '[data-swipe-list-tab-container="' +
            id +
            '"][data-type="' +
            type +
            '"]'
        ),
        $container = $(
          '[data-swipe-list-tab-container="' +
            id +
            '"][data-type="' +
            type +
            '"][data-index="' +
            index +
            '"]'
        ),
        $bodyContainers = $(
          '[data-swipe-list-body="' + id + '"][data-type="' + type + '"]'
        ),
        $bodyContainer = $(
          '[data-swipe-list-body="' +
            id +
            '"][data-type="' +
            type +
            '"][data-index="' +
            index +
            '"]'
        ),
        $count = $('[data-swipe-list-items-count-container="' + id + '"]');

      $containers.hide();
      $bodyContainers.hide();
      $container.show();
      $bodyContainer.show();

      //index == 1 ? $count.show() : $count.hide();
    },
    // 点击添加文章
    onClickSelectArticle: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-select-article')),
        type = parseInt($this.attr('data-type')), // 1: 佛事，2: 文章
        $popup = $(
          '[data-swipe-list-popup="' + id + '"][data-type="' + type + '"]'
        ),
        $editContainer = $this.parents('[data-container="component-edit"]'),
        isUpdate = !!parseInt($editContainer.attr('data-is-update'));

      $popup.length
        ? $popup.show()
        : self.createSwipeListPopup(id, isUpdate, type);
    },
    // 创建图文组件多额弹出框
    createSwipeListPopup: function(id, isUpdate, type) {
      var self = this,
        $popup = $(
          swipeTpl.editPopup.render({
            id: id,
            type: type,
          })
        ),
        urlName = type == 1 ? 'buddhist' : 'article';
      $popup.appendTo('body');
      $popup.show();

      // body禁止滚动
      $('body').css({
        overflow: 'hidden',
      });
      // 创建佛事第一页容器
      $(
        '[data-swipe-list-popup-content="' + id + '"][data-type="' + type + '"]'
      ).html(
        swipeTpl.editPopupPaginationContent.render({
          id: id,
          type: type,
          pageIndex: 1,
        })
      );
      // 请求佛事或文章数据
      $.seeAjax.get(
        urlName,
        {
          page: 1,
          componentId: isUpdate ? id : 0,
        },
        function(res) {
          res.success
            ? swipeListViewUtil.onRequestBuddhistOrArticleSuccess(res, id, type)
            : res.message &&
              $.alert({
                title: false,
                content: res.message,
                buttons: { ok: { text: '确定' } },
                theme: 'white',
              });
        }
      );
    },
  });
});
