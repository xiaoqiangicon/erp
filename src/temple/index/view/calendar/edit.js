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
    'click [data-edit-calendar-add]': 'onClickEditCalendarAdd',
    'click [data-calendar-popup-add-huddhist]':
      'onClickCalendarPopupAddBuddhist',
    'click [data-calendar-buddhist-selected]':
      'onClickCalendarBuddhistSelectCell',
  },
  onClickEditCalendarAdd: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('[data-edit-calendar-add]')),
      $popup = $('[data-calendar-popup="' + id + '"]');
    $('body').css({
      overflow: 'hidden',
    });
    $popup.length ? $popup.show() : self.createCalendarPopup(id);
  },
  createCalendarPopup: function(id) {
    var self = this,
      $popup = $(
        calendarTpl.editPopup.render({
          id: id,
        })
      );
    $popup.appendTo('body');
    $popup.show();
    self.addListenerAfterCreateCalendarPopup();
  },
  addListenerAfterCreateCalendarPopup: function() {
    var self = this;
    $('[data-popup-calendar-add-time]').bootstrapMaterialDatePicker({
      time: false,
      lang: 'zh-cn',
      cancelText: '取消',
      okText: '确定',
      clearText: '清除',
      nowText: '现在',
      minDate: new Date(),
      multiple: !0,
      defaultSelected: !1,
      withLunar: !0,
      onSelected: function(dates) {
        self.onCalendarPopupDateSelected(dates);
      },
    });
  },
  onCalendarPopupDateSelected: function(dates) {
    var self = this,
      $dateContainer = $('[data-calendar-popup-date-container]');
    dates.map(function(date, index) {
      !$(
        '[data-calendar-popup-date-cell][data-year="' +
          date.year +
          '"][data-month="' +
          date.month +
          '"][data-day="' +
          date.day +
          '"]'
      ).length &&
        $dateContainer.append(calendarTpl.editPopupDateCell.render(date));
    });
  },
  onClickCalendarPopupAddBuddhist: function(e) {
    var self = this,
      $popup = $('[data-calendar-buddhist-popup]');
    $popup.length ? $popup.show() : self.createCalendarBuddhistPopup();
  },
  createCalendarBuddhistPopup: function() {
    var self = this,
      $popup = $(calendarTpl.editBuddhistPopup.render({}));
    $popup.appendTo('body');
    $popup.show();
    $('body').css({
      overflow: 'hidden',
    });
    $('[data-calendar-buddhist-popup-content][data-tab-index="1"]').html(
      calendarTpl.editBuddhistPopupPaginationContent.render({
        tabIndex: 1,
        pageIndex: 1,
      })
    );
    seeAjax(
      'calendarBuddhist',
      {
        page: 1,
      },
      function(res) {
        res.success
          ? calendarViewUtil.onRequestCalendarBuddhistOrArticleSuccess(res, 1)
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
    $('[data-swipe-list-popup-content][data-tab-index="2"]').html(
      calendarTpl.editBuddhistPopupPaginationContent.render({
        tabIndex: 2,
        pageIndex: 1,
      })
    );
  },
  onClickCalendarBuddhistSelectCell: function(e) {
    var $this = $(e.target),
      selected = !!parseInt($this.attr('data-calendar-buddhist-selected'));
    selected
      ? ($this.removeClass('active'),
        $this.attr({
          'data-calendar-buddhist-selected': 0,
        }),
        $this.text('选取'))
      : ($this.addClass('active'),
        $this.attr({
          'data-calendar-buddhist-selected': 1,
        }),
        $this.text('已选取'));
  },
});
