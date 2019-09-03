import seeAjax from 'see-ajax';
import $ from 'jquery';
import indexData from '../../data';
import commonTpl from '../../tpl/common';
import calendarTpl from '../../tpl/calendar';
import calendarViewUtil from './util';
import 'lib/bootstrap-material-datetimepicker';
import 'jquery-confirm';
import seeView from 'see-view';
seeView({
  events: {
    'click [data-calendar-buddhist-popup]': 'onClickCalendarBuddhistPopup',
    'click [data-calendar-buddhist-reserve-selected]':
      'onClickCalendarBuddhistReserveSelected',
    'click [data-calendar-buddhist-page-index]':
      'onClickCalendarBuddhistPageIndex',
    'click [data-calendar-popup-new-title]': 'onClickCalendarPopupNewTitle',
    'click [data-calendar-new-title-add]': 'onClickCalendarNewTitleAdd',
  },
  onClickCalendarBuddhistPopup: function(e) {
    var $this = $(e.target),
      close =
        !!$this.attr('data-popup-close') ||
        !!$this.attr('data-popup-backdrop') ||
        !!$this.parent().attr('data-popup-close'),
      $modal,
      $selectedButtons;
    if (close) {
      $modal = $this.parents('.modal');
      $modal.hide();
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
      $this.removeClass('active');
      $this.attr({
        'data-calendar-buddhist-selected': 0,
      });
      $this.text('选取');
    });
    $('[data-calendar-buddhist-popup]').hide();
    self.renderSelectedCalendarBuddhistItems(items);
  },
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
  onClickCalendarBuddhistPageIndex: function(e) {
    var self = this,
      $this = $(e.target),
      id,
      tabIndex,
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
    var $editContainer = $('[data-container="component-edit"][data-type="5"]'),
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
      '[data-calendar-buddhist-pagination-content][data-tab-index="' +
        tabIndex +
        '"][data-calendar-buddhist-pagination-index="' +
        page +
        '"]'
    );
    $paginationContainer = $(
      '[data-calendar-buddhist-pagination][data-tab-index="' + tabIndex + '"]'
    );
    $(
      '[data-calendar-buddhist-pagination-content][data-tab-index="' +
        tabIndex +
        '"]'
    ).hide();
    var i,
      il,
      pages = [];
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
    } else {
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
      seeAjax(
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
  onClickCalendarPopupNewTitle: function(e) {
    var self = this,
      $popup = $('[data-calendar-new-title-popup]');
    $popup.length ? $popup.show() : self.createCalendarNewTitlePopup();
  },
  createCalendarNewTitlePopup: function() {
    var self = this,
      $popup = $(calendarTpl.editNewTitlePopup.render({}));
    $popup.appendTo('body');
    $popup.show();
    $('body').css({
      overflow: 'hidden',
    });
  },
  onClickCalendarNewTitleAdd: function(e) {
    var $this = $(e.target),
      $input = $('[data-calendar-new-title-input]'),
      $container = $('[data-calendar-new-title-content]'),
      value = $input.val().trim();
    if (!value) {
      $.alert({
        title: false,
        content: '标题不能为空，请输入',
        buttons: {
          ok: {
            text: '确定',
          },
        },
        theme: 'white',
      });
      return;
    }
    var newTitleId;
    Object.keys(indexData.calendarNewAddedTitle).map(function(key) {
      if (indexData.calendarNewAddedTitle[key] == value) {
        newTitleId = parseInt(key);
        return !1;
      }
    });
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
  },
});
