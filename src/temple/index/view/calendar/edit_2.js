import $ from 'jquery';
import indexData from '../../data';
import commonTpl from '../../tpl/common';
import calendarTpl from '../../tpl/calendar';
import 'lib/bootstrap-material-datetimepicker';
import 'jquery-confirm';
import seeView from 'see-view';
seeView({
  events: {
    'click [data-calendar-modify-selected-activity-delete]':
      'onClickCalendarModifySelectedActivitiesDelete',
    'click [data-calendar-page-index]': 'onClickCalendarPageIndex',
    'change [data-edit-calendar-select-date]': 'onChangeEditCalendarSelectDate',
    'click [data-calendar-popup-date-cell-delete]':
      'onClickCalendarPopupDateCellDelete',
    'click [data-edit-calendar-query-all]': 'onClickEditCalendarQueryAll',
  },
  onClickCalendarModifySelectedActivitiesDelete: function(e) {
    var self = this,
      $this = $(e.target),
      year = $this.attr('data-year'),
      month = $this.attr('data-month'),
      day = $this.attr('data-day'),
      id = $this.attr('data-id'),
      type = $this.attr('data-type');
    $.confirm({
      title: false,
      content: '此删除操作会同步到服务器。<br>确定删除这条数据吗？',
      theme: 'white',
      buttons: {
        confirm: {
          text: '确定',
          action: function() {
            self.deleteActivityOfCalendar($this, year, month, day, id, type);
          },
        },
        cancel: {
          text: '取消',
          action: function() {},
        },
      },
    });
  },
  deleteActivityOfCalendar: function($this, year, month, day, id, type) {
    $this.text('正在删除...');
    $.seeAjax.post(
      'deleteActivityOfCalendar',
      {
        date:
          year +
          '-' +
          (month.length <= 1 ? '0' + month : month) +
          '-' +
          (day.length <= 1 ? '0' + day : day),
        id: id,
        componentId: parseInt(
          $(
            '[data-container="component-edit"][data-type="5"][data-is-update="1"]'
          ).attr('data-id')
        ),
      },
      function(res) {
        $this.text('删除');
        if (res.success) {
          $this
            .parents('[data-calendar-modify-selected-activity-cell]')
            .remove();
          if (!$('[data-calendar-modify-selected-activity-cell]').length) {
            $(
              '[data-edit-calendar-selected-cell]' +
                '[data-year="' +
                year +
                '"][data-month="' +
                month +
                '"][data-day="' +
                day +
                '"]'
            ).remove();
          } else {
            $(
              '[data-edit-calendar-selected-activity-cell]' +
                '[data-year="' +
                year +
                '"][data-month="' +
                month +
                '"][data-day="' +
                day +
                '"]' +
                '[data-id="' +
                id +
                '"][data-type="' +
                type +
                '"]'
            ).remove();
            $('[data-calendar-modify-selected-activity-sequence]').map(function(
              index
            ) {
              $(this).text(index + 1);
            });
          }
        } else {
          !!res.message &&
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
      }
    );
  },
  onClickCalendarPageIndex: function(e) {
    var self = this,
      $this = $(e.target),
      currentPage,
      totalPages,
      page,
      $contentContainer,
      $contentParentContainer,
      $paginationContainer,
      $paginationInput,
      paginationInput,
      paginationInputInt;
    if ($this.hasClass('active') || $this.hasClass('disabled')) return !1;
    currentPage = parseInt($this.attr('data-current-page'));
    totalPages = parseInt($this.attr('data-total-pages'));
    page = parseInt($this.attr('data-calendar-page-index'));
    $paginationInput = $('[data-calendar-pagination-input]');
    paginationInput = $paginationInput.val();
    $paginationInput.val('');
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
      '[data-edit-calendar-selected-content-inner][data-page="' +
        page +
        '"][data-date="0"]'
    );
    $paginationContainer = $('[data-edit-calendar-pagination]');
    $('[data-edit-calendar-selected-content-inner][data-date="0"]').hide();
    var i,
      il,
      pages = [];
    if (!!$contentContainer.length) {
      for (i = 0; i < totalPages; i++) pages.push(i + 1);
      $contentContainer.show();
      $paginationContainer.html(
        calendarTpl.editPagination.render({
          currentPage: page,
          totalPages: totalPages,
          pages: pages,
        })
      );
    } else {
      $contentParentContainer = $(
        '[data-edit-calendar-selected-content][data-date="0"]'
      );
      $contentContainer = $(
        calendarTpl.editPaginationContentOnePage.render({
          page: page,
        })
      );
      $contentContainer.appendTo($contentParentContainer);
      $.seeAjax.get(
        'activitiesOfCalendar',
        {
          page: page,
          date: '',
          componentId: parseInt(
            $this.parents('[data-container="component-edit"]').attr('data-id')
          ),
        },
        function(res) {
          res.success
            ? self.onRequestCalendarSelectedBuddhistSuccess(res)
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
  onRequestCalendarSelectedBuddhistSuccess: function(res) {
    res.currentPage <= 0 &&
      (res.currentPage = indexData.misc.calendarSelectedBuddhist.totalPages);
    res.totalPages = indexData.misc.calendarSelectedBuddhist.totalPages;
    var $contentContainer = $(
        '[data-edit-calendar-selected-content-inner][data-page="' +
          (res.currentPage || 1) +
          '"][data-date="0"]'
      ),
      $paginationContainer = $('[data-edit-calendar-pagination]'),
      htmlString = '';
    htmlString += calendarTpl.editPaginationContentActivities.render(res);
    $contentContainer.html(htmlString);
    var i,
      il,
      pages = [],
      totalPages = res.totalPages;
    for (i = 0; i < totalPages; i++) pages.push(i + 1);
    $paginationContainer.html(
      calendarTpl.editPagination.render({
        currentPage: res.currentPage || 1,
        totalPages: res.totalPages,
        pages: pages,
      })
    );
  },
  onChangeEditCalendarSelectDate: function(e) {
    var self = this,
      $this = $(e.target),
      date = $this.val(),
      $contentContainer,
      $contentParentContainer;
    !date && (date = 0);
    $contentContainer = $(
      '[data-edit-calendar-selected-content][data-date="' + date + '"]'
    );
    $('[data-edit-calendar-selected-content]').hide();
    $('[data-edit-calendar-pagination]').hide();
    if (!!$contentContainer.length) {
      $contentContainer.show();
    } else {
      $contentParentContainer = $(
        '[data-edit-calendar-selected-content-container]'
      );
      $contentContainer = $(
        calendarTpl.editPaginationContent.render({
          date: date,
        })
      );
      $contentContainer.appendTo($contentParentContainer);
      $.seeAjax.get(
        'activitiesOfCalendar',
        {
          page: 1,
          date: date,
          componentId: parseInt(
            $this.parents('[data-container="component-edit"]').attr('data-id')
          ),
        },
        function(res) {
          res.success
            ? self.onRequestCalendarSelectedBuddhistOfSpecifiedDateSuccess(
                res,
                date
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
  onRequestCalendarSelectedBuddhistOfSpecifiedDateSuccess: function(res, date) {
    var $contentContainer = $(
        '[data-edit-calendar-selected-content][data-date="' + date + '"]'
      ),
      htmlString = '';
    htmlString += calendarTpl.editPaginationContentActivities.render(res);
    $contentContainer.html(htmlString);
  },
  onClickCalendarPopupDateCellDelete: function(e) {
    $(e.target)
      .parent()
      .remove();
  },
  onClickEditCalendarQueryAll: function(e) {
    $('[data-edit-calendar-select-date]')
      .val('')
      .trigger('change');
    $('[data-edit-calendar-pagination]').show();
  },
});
