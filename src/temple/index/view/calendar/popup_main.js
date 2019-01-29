/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  '../../data',
  '../../tpl/common',
  '../../tpl/calendar',
  './util',
  'lib/bootstrap-material-datetimepicker',
  'jquery-confirm',
  'lib/jquery.seeView',
], function($, indexData, commonTpl, calendarTpl, calendarViewUtil) {
  $.seeView({
    events: {
      // 点击关闭佛历佛事弹出框
      'click [data-calendar-buddhist-popup]': 'onClickCalendarBuddhistPopup',
      // 点击确认佛历组件佛事弹出框选择图片
      'click [data-calendar-buddhist-reserve-selected]':
        'onClickCalendarBuddhistReserveSelected',
      // 点击佛历组件佛事弹出框分页
      'click [data-calendar-buddhist-page-index]':
        'onClickCalendarBuddhistPageIndex',
      // 点击佛历弹出框新增标题
      'click [data-calendar-popup-new-title]': 'onClickCalendarPopupNewTitle',
      // 点击添加佛历新条目
      'click [data-calendar-new-title-add]': 'onClickCalendarNewTitleAdd',
    },
    // 点击关闭佛历佛事弹出框
    onClickCalendarBuddhistPopup: function(e) {
      var $this = $(e.target),
        close =
          !!$this.attr('data-popup-close') ||
          !!$this.attr('data-popup-backdrop') ||
          !!$this.parent().attr('data-popup-close'),
        $modal,
        $selectedButtons; // 选中按钮

      if (close) {
        $modal = $this.parents('.modal');
        $modal.hide();
        // body恢复滚动（下面还有弹出框，故注释下面这段代码）
        //$('body').css({
        //    'overflow': 'inherit'
        //});

        $selectedButtons = $(
          '[data-calendar-buddhist-selected="1"][data-tab-index]'
        );
        $selectedButtons.map(function() {
          var $this = $(this);

          $this.removeClass('active');
          $this.attr({
            'data-calendar-buddhist-selected': 0,
          });
          $this.text('选取');
        });
      }
    },
    // 点击确认佛历组件佛事弹出框选择图片
    onClickCalendarBuddhistReserveSelected: function(e) {
      var self = this,
        $this = $(e.target),
        tabIndex = parseInt($this.attr('data-tab-index')),
        id = parseInt($this.attr('data-calendar-buddhist-reserve-selected')),
        articleId = parseInt($this.attr('data-id')),
        $items = $(
          '[data-calendar-buddhist-selected="1"][data-tab-index="' +
            tabIndex +
            '"]'
        ),
        items = [];

      $items.map(function(index) {
        var $this = $(this),
          image = $this.attr('data-image'),
          content = $this.attr('data-content');
        items.push({
          imageId: parseInt($this.attr('data-image-id')),
          image: image,
          content: content,
        });

        // 取消所有的选中状态
        $this.removeClass('active');
        $this.attr({
          'data-calendar-buddhist-selected': 0,
        });
        $this.text('选取');
      });
      // 隐藏弹出框（下面还有弹出框，故注释下面这段代码）
      //$('body').css({
      //    'overflow': 'inherit'
      //});
      $('[data-calendar-buddhist-popup]').hide();
      // 渲染已选择的项目
      self.renderSelectedCalendarBuddhistItems(items);
    },
    // 渲染佛历佛事弹出框已选择的项目
    renderSelectedCalendarBuddhistItems: function(items) {
      var self = this,
        $container = $('[data-calendar-popup-activity-container]');
      items.map(function(item) {
        (item.type = 1),
          !$(
            '[data-calendar-popup-activity-cell][data-type="1"][data-activity-id="' +
              item.imageId +
              '"]'
          ).length &&
            $container.append(
              calendarTpl.editPopupActivityCell.render({
                type: 1,
                activityId: item.imageId,
                title: item.content,
                image: item.image,
              })
            );
      });
    },
    // 点击佛历组件佛事弹出框分页
    onClickCalendarBuddhistPageIndex: function(e) {
      var self = this,
        $this = $(e.target),
        id, // 组件id
        tabIndex, // tab index
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
      tabIndex = parseInt($this.attr('data-tab-index'));
      currentPage = parseInt($this.attr('data-current-page'));
      totalCount = parseInt($this.attr('data-total-count'));
      perPage = parseInt($this.attr('data-per-page'));
      totalPages = parseInt($this.attr('data-total-pages'));
      page = parseInt($this.attr('data-calendar-buddhist-page-index'));

      $paginationInput = $(
        '[data-calendar-buddhist-pagination-input][data-tab-index="' +
          tabIndex +
          '"]'
      );
      paginationInput = $paginationInput.val();
      $paginationInput.val('');

      var $editContainer = $(
          '[data-container="component-edit"][data-type="5"]'
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
        '[data-calendar-buddhist-pagination-content][data-tab-index="' +
          tabIndex +
          '"][data-calendar-buddhist-pagination-index="' +
          page +
          '"]'
      );
      $paginationContainer = $(
        '[data-calendar-buddhist-pagination][data-tab-index="' + tabIndex + '"]'
      );
      // 先隐藏同类容器
      $(
        '[data-calendar-buddhist-pagination-content][data-tab-index="' +
          tabIndex +
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
          calendarTpl.editBuddhistPopupPagination.render({
            totalCount: totalCount,
            perPage: perPage,
            currentPage: page,
            totalPages: totalPages,
            pages: pages,
            id: id,
            tabIndex: tabIndex,
          })
        );
      }
      // 未请求过，则请求之后渲染
      else {
        $contentParentContainer = $(
          '[data-calendar-buddhist-popup-content][data-tab-index="' +
            tabIndex +
            '"]'
        );
        $contentContainer = $(
          calendarTpl.editBuddhistPopupPaginationContent.render({
            id: id,
            tabIndex: tabIndex,
            pageIndex: page,
          })
        );
        $contentContainer.appendTo($contentParentContainer);
        urlMark = tabIndex == 1 ? 'calendarBuddhist' : 'calendarArticle';
        // 请求数据
        // 请求佛事数据
        $.seeAjax.get(
          urlMark,
          {
            page: page,
          },
          function(res) {
            res.success
              ? calendarViewUtil.onRequestCalendarBuddhistOrArticleSuccess(
                  res,
                  tabIndex
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
    // 点击佛历弹出框新增标题
    onClickCalendarPopupNewTitle: function(e) {
      var self = this,
        $popup = $('[data-calendar-new-title-popup]');

      $popup.length ? $popup.show() : self.createCalendarNewTitlePopup();
    },
    // 创建佛历新增条目弹出框
    createCalendarNewTitlePopup: function() {
      var self = this,
        $popup = $(calendarTpl.editNewTitlePopup.render({}));
      $popup.appendTo('body');
      $popup.show();

      // body禁止滚动
      $('body').css({
        overflow: 'hidden',
      });
    },
    // 点击添加佛历新条目
    onClickCalendarNewTitleAdd: function(e) {
      var $this = $(e.target),
        $input = $('[data-calendar-new-title-input]'),
        $container = $('[data-calendar-new-title-content]'),
        value = $input.val().trim();

      if (!value) {
        $.alert({
          title: false,
          content: '标题不能为空，请输入',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        return;
      }

      var newTitleId;
      // 遍历已有的数据，看是否已经添加过
      Object.keys(indexData.calendarNewAddedTitle).map(function(key) {
        if (indexData.calendarNewAddedTitle[key] == value) {
          newTitleId = parseInt(key);
          return !1;
        }
      });
      // 未添加过
      !newTitleId &&
        ((newTitleId = indexData.calendarNewAddedTitleId++),
        (indexData.calendarNewAddedTitle[newTitleId] = value));
      $input.val('');
      !$('[data-calendar-new-title-content-cell][data-id="' + newTitleId + '"]')
        .length &&
        $container.append(
          calendarTpl.editNewTitleContentCell.render({
            contentId: newTitleId,
            text: value,
          })
        );

      // 由于后端没有给我想要的接口，故注释掉一下代码

      //$this.text('正在保存...');
      //
      //$.seeAjax.get('calendarNewTitle', {
      //    title: value
      //}, function(res) {
      //    $this.text('新增');
      //    res.success ? (
      //        $input.val(''),
      //        $container.append(calendarTpl.editNewTitleContentCell.render({
      //            contentId: res.id,
      //            text: res.text
      //        }))
      //    ) : (
      //        res.message && $.alert({
      //            title: false,
      //            content: res.message,
      //            buttons: {ok: {text:'确定'}},
      //            theme: 'white'
      //        })
      //    );
      //});
    },
  });
});
