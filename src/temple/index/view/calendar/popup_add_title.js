/**
 * Created by senntyou on 2017/2/27.
 */
define([
  'jquery',
  '../../data',
  '../../tpl/common',
  '../../tpl/calendar',
  'lib/bootstrap-material-datetimepicker',
  'jquery-confirm',
  'lib/jquery.seeView',
], function($, indexData, commonTpl, calendarTpl) {
  $.seeView({
    events: {
      // 点击删除已添加的佛历组件新建条目
      'click [data-calendar-new-title-content-cell-delete]':
        'onClickCalendarNewTitleContentCellDelete',
      // 点击佛历组件弹出框的确定按钮，添加条目到上一个弹出层
      'click [data-calendar-new-title-ok]': 'onClickCalendarNewTitleOk',
      // 点击关闭佛历新建条目弹出框
      'click [data-calendar-new-title-popup]': 'onClickCalendarNewTitlePopup',
    },
    // 点击删除已添加的佛历组件新建条目
    onClickCalendarNewTitleContentCellDelete: function(e) {
      $(e.target)
        .parent()
        .remove();
    },
    // 点击佛历组件弹出框的确定按钮，添加条目到上一个弹出层
    onClickCalendarNewTitleOk: function(e) {
      var self = this,
        $contentContainer = $('[data-calendar-new-title-content]'), // 装添加的项目的容器
        $input = $('[data-calendar-new-title-input]'), // 输入表格
        inputValue = $input.val(),
        $items = $('[data-calendar-new-title-content-cell]'),
        items = [];

      $items.map(function(index) {
        var $this = $(this);

        items.push({
          id: parseInt($this.attr('data-id')),
          content: $this.attr('data-text'),
        });
      });
      // 如果用户直接点击保存，那么输入框中的值也要加入
      var newTitleId;
      !!inputValue &&
        inputValue.trim() &&
        ((inputValue = inputValue.trim()),
        // 遍历已有的数据，看是否已经添加过
        Object.keys(indexData.calendarNewAddedTitle).map(function(key) {
          if (indexData.calendarNewAddedTitle[key] == inputValue) {
            newTitleId = parseInt(key);
            return !1;
          }
        }),
        // 未添加过
        !newTitleId &&
          ((newTitleId = indexData.calendarNewAddedTitleId++),
          (indexData.calendarNewAddedTitle[newTitleId] = inputValue)),
        items.push({
          id: newTitleId,
          content: inputValue,
        }));
      // 清空项目容器
      $contentContainer.html('');
      // 清空输入表单
      $input.val('');
      // 隐藏弹出框
      $('[data-calendar-new-title-popup]').hide();
      // 渲染已选择的项目
      self.renderAddedCalendarBuddhistItems(items);
    },
    // 渲染佛历新建条目添加的项目
    renderAddedCalendarBuddhistItems: function(items) {
      var self = this,
        $container = $('[data-calendar-popup-activity-container]');
      items.map(function(item) {
        (item.type = 2),
          !$(
            '[data-calendar-popup-activity-cell][data-type="2"][data-activity-id="' +
              item.id +
              '"]'
          ).length &&
            $container.append(
              calendarTpl.editPopupActivityCell.render({
                type: 2,
                activityId: item.id,
                title: item.content,
              })
            );
      });
    },
    // 点击关闭佛历新建条目弹出框
    onClickCalendarNewTitlePopup: function(e) {
      var $this = $(e.target),
        close =
          !!$this.attr('data-popup-close') ||
          !!$this.attr('data-popup-backdrop') ||
          !!$this.parent().attr('data-popup-close'),
        $modal,
        $contentContainer = $('[data-calendar-new-title-content]'), // 装添加的项目的容器
        $input = $('[data-calendar-new-title-input]'); // 输入表格

      if (close) {
        $modal = $this.parents('.modal');
        $modal.hide();
        // body恢复滚动（下面还有弹出框，故注释下面这段代码）
        //$('body').css({
        //    'overflow': 'inherit'
        //});

        // 清空项目容器
        $contentContainer.html('');
        // 清空输入表单
        $input.val('');
      }
    },
  });
});
