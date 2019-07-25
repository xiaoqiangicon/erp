/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  '../../data',
  '../../tpl/common',
  '../../tpl/swipe_list',
  '../../function',
  './util',
  'swiper',
  'jquery-confirm',
  'lib/jquery.seeView',
  '../../ajax',
], function($, indexData, commonTpl, swipeTpl, func, swipeListViewUtil) {
  $.seeView({
    events: {
      // 点击tab，切换标签页
      'click [data-tab]': 'onClickTab',
      // 点击关闭图文组件弹出框
      'click [data-swipe-list-popup]': 'onClickSwipeListPopup',
      // 点击分页
      'click [data-page-index]': 'onClickPageIndex',
      // 点击选择项目
      'click [data-swipe-list-selected]': 'onClickSwipeListSelectCell',
      // 点击确认选择图片
      'click [data-swipe-list-reserve-selected]':
        'onClickSwipeListReserveSelected',
    },
    // 点击tab，切换标签页
    onClickTab: function(e) {
      var $this = $(e.target),
        type = $this.attr('data-type'),
        id = parseInt($this.attr('data-tab')),
        $tabs,
        $containers,
        $container;
      // 如果本来就处于激活状态
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
    // 点击关闭图文组件弹出框
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
        // body恢复滚动
        $('body').css({
          overflow: 'inherit',
        });

        componentId = parseInt($modal.attr('data-swipe-list-popup'));

        // 已选择的项目清空
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
    // 点击分页
    onClickPageIndex: function(e) {
      var self = this,
        $this = $(e.target),
        id, // 组件id
        type, // type
        currentPage, // 当前页
        totalCount, // 总数
        perPage, // 每页数
        totalPages, // 总页数
        page, // 按钮指向页数
        $contentContainer, // 内容容器
        $contentParentContainer, // 内容容器父元素
        $paginationContainer, // 分页容器
        urlMark, // url标示
        $paginationInput,
        paginationInput,
        paginationInputInt; // 跳到某一页的输入

      // 如果当前已经处于激活状态，或者禁用，返回
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
          '[data-container="component-edit"][data-type="3"][data-id="' +
            id +
            '"]'
        ),
        isUpdate = !!parseInt($editContainer.attr('data-is-update'));

      if (page == -1) {
        // 上一页
        page = currentPage - 1;
      } else if (page == -2) {
        // 下一页
        page = currentPage + 1;
      } else if (page == -3) {
        // 跳到某一页
        // 没有值，直接返回
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
      // 先隐藏同类容器
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

      // 如果已经请求过了，就直接显示
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
      }
      // 未请求过，则请求之后渲染
      else {
        $contentParentContainer = $(
          '[data-swipe-list-popup-content="' +
            id +
            '"][data-type="' +
            type +
            '"]'
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
        // 请求数据
        // 请求佛事数据
        $.seeAjax.get(
          urlMark,
          {
            page: page,
            componentId: isUpdate ? id : 0,
          },
          function(res) {
            res.success
              ? swipeListViewUtil.onRequestBuddhistOrArticleSuccess(
                  res,
                  id,
                  type
                )
              : res.message &&
                $.alert({
                  title: false,
                  content: res.message,
                  buttons: { ok: { text: '确定' } },
                  theme: 'white',
                });
          }
        );
      }
    },
    // 点击选择项目
    onClickSwipeListSelectCell: function(e) {
      var $this = $(e.target),
        selected = !!parseInt($this.attr('data-swipe-list-selected'));

      /**
       * mark-1: 测试给出的逻辑，改在这里，一下是源代码（恢复）
       */
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
      /**
       * mark-1: end
       */

      /**
       * mark-2: 实现测试给出的逻辑新代码（恢复）
       */

      //if (selected) return;
      //
      //$this.addClass('active');
      //$this.attr({
      //    'data-swipe-list-selected': 1
      //});
      //$this.text('已选取');

      /**
       * mark-2: end
       */
    },
    // 点击确认选择图片
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

      //var componentSubType = parseInt($('[data-swipe-list-sub-type="' + id + '"]:checked').val());

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
      // 隐藏弹出框
      $('body').css({
        overflow: 'inherit',
      });
      $(
        '[data-swipe-list-popup="' + id + '"][data-type="' + type + '"]'
      ).hide();
      // 渲染已选择的项目
      self.renderSelectedSwipeListItems(items, id, type);

      // 已选择的项目清空
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
    // 渲染已选择的项目
    renderSelectedSwipeListItems: function(items, id, type) {
      var self = this,
        $addEl = $(
          '[data-select-article-container="' +
            id +
            '"][data-type="' +
            type +
            '"]'
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
        //!$('[data-upload-image-container="' + item.imageId + '"][data-component-id="' + id + '"]').length && (
        //    $addEl.before(swipeTpl.editSelectedCell.render(item)),
        //        $swiperListWrapper.append(swipeTpl.displayImageCell.render(item))
        //)
        $addEl.before(swipeTpl.editSelectedCell.render(item)),
          // 更换图片尺寸
          (item.image =
            item.image.slice(0, item.image.indexOf('?')) +
            indexData.imagesParams[3][componentSubType - 1]),
          $swiperListWrapper.append(swipeTpl.displayImageCell.render(item));
      });

      func.reshowSwipeList(id, type, 2);
    },
  });
});
