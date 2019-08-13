import $ from 'jquery';
import indexData from '../../data';
import commonTpl from '../../tpl/common';
import swipeTpl from '../../tpl/swipe_list';
import func from '../../function';
import swipeListViewUtil from './util';
import 'swiper';
import 'jquery-confirm';
import 'lib/jquery.seeView';
import '../../ajax';
$.seeView({
  events: {
    'click [data-tab]': 'onClickTab',
    'click [data-swipe-list-popup]': 'onClickSwipeListPopup',
    'click [data-page-index]': 'onClickPageIndex',
    'click [data-swipe-list-selected]': 'onClickSwipeListSelectCell',
    'click [data-swipe-list-reserve-selected]':
      'onClickSwipeListReserveSelected',
  },
  onClickTab: function(e) {
    var $this = $(e.target),
      type = $this.attr('data-type'),
      id = parseInt($this.attr('data-tab')),
      $tabs,
      $containers,
      $container;
    if ($this.hasClass('active')) return;
    $tabs = $('[data-tab][data-type="' + type + '"]');
    $containers = $('[data-tab-container][data-type="' + type + '"]');
    $container = $(
      '[data-tab-container="' + id + '"][data-type="' + type + '"]'
    );
    $tabs.removeClass('active');
    $this.addClass('active');
    $containers.hide();
    $container.show();
  },
  onClickSwipeListPopup: function(e) {
    var $this = $(e.target),
      close =
        !!$this.attr('data-popup-close') ||
        !!$this.attr('data-popup-backdrop') ||
        !!$this.parent().attr('data-popup-close'),
      $modal,
      type,
      componentId;
    if (close) {
      $modal = $this.parents('.modal');
      type = parseInt($modal.attr('data-type'));
      $modal.hide();
      $('body').css({
        overflow: 'inherit',
      });
      componentId = parseInt($modal.attr('data-swipe-list-popup'));
      $(
        '[data-swipe-list-selected][data-component-id="' +
          componentId +
          '"][data-type="' +
          type +
          '"]'
      )
        .removeClass('active')
        .attr({
          'data-swipe-list-selected': 0,
        })
        .text('选取');
    }
  },
  onClickPageIndex: function(e) {
    var self = this,
      $this = $(e.target),
      id,
      type,
      currentPage,
      totalCount,
      perPage,
      totalPages,
      page,
      $contentContainer,
      $contentParentContainer,
      $paginationContainer,
      urlMark,
      $paginationInput,
      paginationInput,
      paginationInputInt;
    if ($this.hasClass('active') || $this.hasClass('disabled')) return !1;
    id = parseInt($this.attr('data-id'));
    type = parseInt($this.attr('data-type'));
    currentPage = parseInt($this.attr('data-current-page'));
    totalCount = parseInt($this.attr('data-total-count'));
    perPage = parseInt($this.attr('data-per-page'));
    totalPages = parseInt($this.attr('data-total-pages'));
    page = parseInt($this.attr('data-page-index'));
    $paginationInput = $(
      '[data-pagination-input="' + id + '"][data-type="' + type + '"]'
    );
    paginationInput = $paginationInput.val();
    $paginationInput.val('');
    var $editContainer = $(
        '[data-container="component-edit"][data-type="3"][data-id="' + id + '"]'
      ),
      isUpdate = !!parseInt($editContainer.attr('data-is-update'));
    if (page == -1) {
      page = currentPage - 1;
    } else if (page == -2) {
      page = currentPage + 1;
    } else if (page == -3) {
      if (!paginationInput) {
        return;
      }
      paginationInputInt = parseInt(paginationInput);
      if (
        !paginationInputInt ||
        paginationInputInt <= 0 ||
        paginationInputInt > totalPages
      ) {
        return;
      }
      page = paginationInput;
    }
    $contentContainer = $(
      '[data-swipe-list-pagination-content="' +
        id +
        '"][data-type="' +
        type +
        '"][data-pagination-index="' +
        page +
        '"]'
    );
    $paginationContainer = $(
      '[data-swipe-list-pagination="' + id + '"][data-type="' + type + '"]'
    );
    $(
      '[data-swipe-list-pagination-content="' +
        id +
        '"][data-type="' +
        type +
        '"]'
    ).hide();
    var i,
      il,
      pages = [];
    if (!!$contentContainer.length) {
      for (i = 0; i < totalPages; i++) pages.push(i + 1);
      $contentContainer.show();
      $paginationContainer.html(
        swipeTpl.editPopupPagination.render({
          totalCount: totalCount,
          perPage: perPage,
          currentPage: page,
          totalPages: totalPages,
          pages: pages,
          id: id,
          type: type,
        })
      );
    } else {
      $contentParentContainer = $(
        '[data-swipe-list-popup-content="' + id + '"][data-type="' + type + '"]'
      );
      $contentContainer = $(
        swipeTpl.editPopupPaginationContent.render({
          id: id,
          type: type,
          pageIndex: page,
        })
      );
      $contentContainer.appendTo($contentParentContainer);
      urlMark = type == 1 ? 'buddhist' : 'article';
      $.seeAjax.get(
        urlMark,
        {
          page: page,
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
    }
  },
  onClickSwipeListSelectCell: function(e) {
    var $this = $(e.target),
      selected = !!parseInt($this.attr('data-swipe-list-selected'));
    selected
      ? ($this.removeClass('active'),
        $this.attr({
          'data-swipe-list-selected': 0,
        }),
        $this.text('选取'))
      : ($this.addClass('active'),
        $this.attr({
          'data-swipe-list-selected': 1,
        }),
        $this.text('已选取'));
  },
  onClickSwipeListReserveSelected: function(e) {
    var self = this,
      $this = $(e.target),
      type = parseInt($this.attr('data-type')),
      id = parseInt($this.attr('data-swipe-list-reserve-selected')),
      $items = $(
        '[data-swipe-list-selected="1"][data-type="' +
          type +
          '"][data-component-id="' +
          id +
          '"]'
      ),
      items = [];
    $items.map(function(index) {
      var $this = $(this),
        image = $this.attr('data-image'),
        content = $this.attr('data-content'),
        status = parseInt($this.attr('data-status'));
      items.push({
        imageId: parseInt($this.attr('data-image-id')),
        image: image,
        content: content,
        componentId: id,
        status: status,
        sourceType: type,
      });
    });
    $('body').css({
      overflow: 'inherit',
    });
    $('[data-swipe-list-popup="' + id + '"][data-type="' + type + '"]').hide();
    self.renderSelectedSwipeListItems(items, id, type);
    $(
      '[data-swipe-list-selected][data-type="' +
        type +
        '"][data-component-id="' +
        id +
        '"]'
    )
      .removeClass('active')
      .attr({
        'data-swipe-list-selected': 0,
      })
      .text('选取');
  },
  renderSelectedSwipeListItems: function(items, id, type) {
    var self = this,
      $addEl = $(
        '[data-select-article-container="' + id + '"][data-type="' + type + '"]'
      ),
      $swiperListWrapper = $(
        '[data-swipe-list-swiper-wrapper="' +
          id +
          '"][data-type="' +
          type +
          '"][data-index="2"]'
      );
    var componentSubType = parseInt(
      $('[data-swipe-list-sub-type="' + id + '"]:checked').val()
    );
    items.map(function(item) {
      $addEl.before(swipeTpl.editSelectedCell.render(item)),
        (item.image =
          item.image.slice(0, item.image.indexOf('?')) +
          indexData.imagesParams[3][componentSubType - 1]),
        $swiperListWrapper.append(swipeTpl.displayImageCell.render(item));
    });
    func.reshowSwipeList(id, type, 2);
  },
});
