import $ from 'jquery';
import indexData from '../../data';
import commonTpl from '../../tpl/common';
import swipeTpl from '../../tpl/swipe_list';
import swipeListViewUtil from './util';
import 'swiper';
import 'jquery-confirm';
import seeView from 'see-view';
import '../../ajax';
seeView({
  events: {
    'keyup [data-swipe-list-title]': 'onKeyUpInSwipeListTitle',
    'change [data-swipe-list-show-title]': 'onChangeSwipeListShowTitle',
    'change [data-swipe-list-show-more]': 'onChangeSwipeListShowMore',
    'change [data-swipe-list-items-count]': 'onChangeInSwipeListItemsCount',
    'change [data-swipe-list-sub-type]': 'onChangeSwipeListSubType',
    'change [data-swipe-list-source-category]':
      'onClickSwipeListSourceCategory',
    'change [data-swipe-list-source-sub-category]':
      'onChangeSwipeListSourceSubCategory',
    'change [data-swipe-list-tab]': 'onSwipeListTabChange',
    'click [data-select-article]': 'onClickSelectArticle',
  },
  onKeyUpInSwipeListTitle: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-swipe-list-title')),
      value = $this.val().trim();
    $('[data-swipe-list-title-display="' + id + '"]').text(value);
  },
  onChangeSwipeListShowTitle: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-swipe-list-show-title')),
      show = $this.prop('checked'),
      $container = $('[data-swipe-list-title-container="' + id + '"]');
    show ? $container.show() : $container.hide();
  },
  onChangeSwipeListShowMore(e) {
    const $this = $(e.target);
    const id = parseInt($this.attr('data-swipe-list-show-more'));
    const show = $this.prop('checked');
    const $container = $('[data-swipe-list-more="' + id + '"]');
    show ? $container.show() : $container.hide();
  },
  onChangeInSwipeListItemsCount: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-swipe-list-items-count')),
      count = parseInt($this.val());
    $('[data-swipe-list-cell="' + id + '"][data-type="1"][data-index="1"]').map(
      function(index) {
        index < count
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      }
    );
    $('[data-swipe-list-cell="' + id + '"][data-type="1"][data-index="2"]').map(
      function(index) {
        index < count
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      }
    );
    $('[data-swipe-list-cell="' + id + '"][data-type="2"][data-index="1"]').map(
      function(index) {
        index < count
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      }
    );
    $('[data-swipe-list-cell="' + id + '"][data-type="2"][data-index="2"]').map(
      function(index) {
        index < count
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      }
    );
  },
  onChangeSwipeListSubType: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-swipe-list-sub-type')),
      $checked = $('[data-swipe-list-sub-type="' + id + '"]:checked'),
      subType = parseInt($checked.val()),
      $container = $('[data-swipe-list-body="' + id + '"]'),
      $displayCells = $('[data-swipe-list-cell="' + id + '"]');
    if (subType == 1) {
      $container.removeClass('vertical two-columns vertical-small');
    } else if (subType == 2) {
      $container.removeClass('two-columns');
      $container.removeClass('vertical-small');
      $container.addClass('vertical');
    } else if (subType == 3) {
      $container.removeClass('vertical');
      $container.removeClass('vertical-small');
      $container.addClass('two-columns');
    } else if (subType == 4) {
      $container.removeClass('vertical');
      $container.removeClass('two-columns');
      $container.addClass('vertical-small');
    }
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
  },
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
    indexData.misc[typeName].map(function(item) {
      if (item.id == subCategoryId) {
        sourceSubCategoryData = item;
        return !1;
      }
    });
    !!sourceSubCategoryData &&
      (sourceSubCategoryData.images.map(function(item) {
        swiperWrapperInnerHtmlIndex1 += swipeTpl.displayImageCellIndex1.render({
          componentId: id,
          image:
            item.url.indexOf('?') != -1
              ? item.url.slice(0, item.url.indexOf('?')) +
                indexData.imagesParams[3][componentSubType - 1]
              : item.url + indexData.imagesParams[3][componentSubType - 1],
          content: item.name,
          status: item.status,
          type: type,
        });
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
        '[data-swipe-list-tab-container="' + id + '"][data-type="' + type + '"]'
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
  },
  onClickSelectArticle: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-select-article')),
      type = parseInt($this.attr('data-type')),
      $popup = $(
        '[data-swipe-list-popup="' + id + '"][data-type="' + type + '"]'
      ),
      $editContainer = $this.parents('[data-container="component-edit"]'),
      isUpdate = !!parseInt($editContainer.attr('data-is-update'));
    $popup.length
      ? $popup.show()
      : self.createSwipeListPopup(id, isUpdate, type);
  },
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
    $('body').css({
      overflow: 'hidden',
    });
    $(
      '[data-swipe-list-popup-content="' + id + '"][data-type="' + type + '"]'
    ).html(
      swipeTpl.editPopupPaginationContent.render({
        id: id,
        type: type,
        pageIndex: 1,
      })
    );
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
              buttons: {
                ok: {
                  text: '确定',
                },
              },
              theme: 'white',
            });
      }
    );
  },
});
