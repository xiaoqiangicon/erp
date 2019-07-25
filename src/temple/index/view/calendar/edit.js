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
      // 点击弹出日历弹出框添加时间和活动
      'click [data-edit-calendar-add]': 'onClickEditCalendarAdd',
      // 点击佛历弹出框添加佛事
      'click [data-calendar-popup-add-huddhist]':
        'onClickCalendarPopupAddBuddhist',
      // 点击佛历佛事弹出框选择项目
      'click [data-calendar-buddhist-selected]':
        'onClickCalendarBuddhistSelectCell',
    },
    // 点击弹出日历弹出框添加时间和活动
    onClickEditCalendarAdd: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('[data-edit-calendar-add]')),
        $popup = $('[data-calendar-popup="' + id + '"]');

      // body禁止滚动
      $('body').css({
        overflow: 'hidden',
      });

      $popup.length ? $popup.show() : self.createCalendarPopup(id);
    },
    // 创建佛历组件多额弹出框
    createCalendarPopup: function(id) {
      var self = this,
        $popup = $(calendarTpl.editPopup.render({ id: id }));
      $popup.appendTo('body');
      $popup.show();

      self.addListenerAfterCreateCalendarPopup();
    },
    //创建佛历组件弹出框后增加事件监听后
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
    // 佛历弹出框选择时间后添加到页面之中
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
    // 点击佛历弹出框添加佛事
    onClickCalendarPopupAddBuddhist: function(e) {
      var self = this,
        $popup = $('[data-calendar-buddhist-popup]');

      $popup.length ? $popup.show() : self.createCalendarBuddhistPopup();
    },
    // 创建佛历选择佛事弹出框
    createCalendarBuddhistPopup: function() {
      var self = this,
        $popup = $(calendarTpl.editBuddhistPopup.render({}));
      $popup.appendTo('body');
      $popup.show();

      // body禁止滚动
      $('body').css({
        overflow: 'hidden',
      });
      // 创建佛事第一页容器
      $('[data-calendar-buddhist-popup-content][data-tab-index="1"]').html(
        calendarTpl.editBuddhistPopupPaginationContent.render({
          tabIndex: 1,
          pageIndex: 1,
        })
      );
      // 请求佛事数据
      $.seeAjax.get(
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
                buttons: { ok: { text: '确定' } },
                theme: 'white',
              });
        }
      );
      // 创建文章第一页容器
      $('[data-swipe-list-popup-content][data-tab-index="2"]').html(
        calendarTpl.editBuddhistPopupPaginationContent.render({
          tabIndex: 2,
          pageIndex: 1,
        })
      );
    },
    // 点击佛历佛事弹出框选择项目
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
});
