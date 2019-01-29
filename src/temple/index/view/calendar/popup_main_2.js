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
      // 点击关闭佛历弹出框，清楚数据
      'click [data-calendar-popup]': 'onClickCalendarPopup',
      // 点击确定保存佛历第一个弹出框的数据
      'click [data-calendar-popup-ok]': 'onClickCalendarPopupOk',
      // 佛历组件修改新添加的项目
      'click [data-edit-calendar-new-add-cell-modify]':
        'onClickCalendarNewAddCellModify',
      // 点击关闭佛历修改新添加条目弹出框
      'click [data-calendar-modify-new-add-activities-popup]':
        'onClickCalendarModifyNewAddActivitiesPopup',
      // 点击删除佛历新添加条目
      'click [data-calendar-modify-new-add-activity-delete]':
        'onClickCalendarModifyNewAddActivitiesDelete',
      // 佛历组件修改已添加的项目
      'click [data-edit-calendar-selected-cell-modify]':
        'onClickCalendarSelectedCellModify',
      // 点击关闭佛历修改已添加条目弹出框
      'click [data-calendar-modify-selected-activities-popup]':
        'onClickCalendarModifySelectedActivitiesPopup',
    },
    // 点击关闭佛历弹出框，清楚数据
    onClickCalendarPopup: function(e) {
      var $this = $(e.target),
        close =
          !!$this.attr('data-popup-close') ||
          !!$this.attr('data-popup-backdrop') ||
          !!$this.parent().attr('data-popup-close'),
        $modal,
        $dateContainer = $('[data-calendar-popup-date-container]'),
        $contentContainer = $('[data-calendar-popup-activity-container]');

      if (close) {
        $modal = $this.parents('.modal');
        $modal.hide();
        // body恢复滚动
        $('body').css({
          overflow: 'inherit',
        });

        // 清空项目容器
        $dateContainer.html('');
        $contentContainer.html('');
      }
    },
    // 点击确定保存佛历第一个弹出框的数据
    onClickCalendarPopupOk: function(e) {
      var self = this,
        $dates = $('[data-calendar-popup-date-cell]'),
        $activities = $('[data-calendar-popup-activity-cell]'),
        $modal = $('[data-calendar-popup]'),
        activities = [],
        dates = [],
        items;

      if (!$dates.length) {
        $.alert({
          title: false,
          content: '您还没有添加日期，请添加',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        return;
      }
      if (!$activities.length) {
        $.alert({
          title: false,
          content: '您还没有添加活动，请添加佛事或新建标题',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        return;
      }

      $activities.map(function(index) {
        var $this = $(this);

        activities.push({
          id: parseInt($this.attr('data-activity-id')),
          type: parseInt($this.attr('data-type')),
          title: $this.attr('data-title'),
          image: $this.attr('data-image') || '',
        });
      });

      $dates.map(function(index) {
        var $this = $(this);
        dates.push({
          year: parseInt($this.attr('data-year')),
          month: parseInt($this.attr('data-month')),
          day: parseInt($this.attr('data-day')),
        });
      });

      items = {
        dates: dates,
        activities: activities,
      };

      // 清空项目容器
      $('[data-calendar-popup-date-container]').html('');
      $('[data-calendar-popup-activity-container]').html('');

      $modal.hide();
      // body恢复滚动
      $('body').css({
        overflow: 'inherit',
      });

      self.onCalendarDatesAndActivitiesSelected(items);
    },
    // 佛历组件弹出框弹出后添加内容
    onCalendarDatesAndActivitiesSelected: function(items) {
      var self = this,
        $contentContainer = $('[data-edit-calendar-new-add-content]'), // 佛历组件编辑总容器
        $unitContainer, // 单元容器
        $unitActivitiesContainer, // 单元容器的活动容器
        unitItems;

      items.dates.map(function(date) {
        $unitContainer = $(
          '[data-edit-calendar-new-add-cell][data-year="' +
            date.year +
            '"][data-month="' +
            date.month +
            '"][data-day="' +
            date.day +
            '"]'
        );
        // 连日期的unit都没有，就创建一个
        if (!$unitContainer.length) {
          unitItems = {
            year: date.year,
            month: date.month,
            day: date.day,
            activities: items.activities,
          };
          $contentContainer.append(
            calendarTpl.editNewAddUnit.render(unitItems)
          );
        } else {
          $unitActivitiesContainer = $unitContainer.find(
            '[data-edit-calendar-new-add-activities-container]'
          );
          items.activities.map(function(activity) {
            !$(
              '[data-edit-calendar-new-add-activity-cell]' +
                '[data-year="' +
                date.year +
                '"][data-month="' +
                date.month +
                '"][data-day="' +
                date.day +
                '"]' +
                '[data-id="' +
                activity.id +
                '"][data-type="' +
                activity.type +
                '"]'
            ).length &&
              $unitActivitiesContainer.append(
                calendarTpl.editNewAddActivityCell.render({
                  year: date.year,
                  month: date.month,
                  day: date.day,
                  activity: activity,
                })
              );
          });
        }
      });
    },
    // 佛历组件修改新添加的项目
    onClickCalendarNewAddCellModify: function(e) {
      var self = this,
        $this = $(e.target),
        year = parseInt($this.attr('data-year')),
        month = parseInt($this.attr('data-month')),
        day = parseInt($this.attr('data-day')),
        $activitiesCells = $(
          '[data-edit-calendar-new-add-activity-cell]' +
            '[data-year="' +
            year +
            '"][data-month="' +
            month +
            '"][data-day="' +
            day +
            '"]'
        ),
        activities = [],
        $popup = $('[data-calendar-modify-new-add-activities-popup]');

      if (!$popup.length) {
        $popup = $(calendarTpl.editModifyNewAddActivitiesPopup.render({}));
        $popup.appendTo('body');
      }

      $popup.show();
      // body禁止滚动
      $('body').css({
        overflow: 'hidden',
      });

      $activitiesCells.map(function(index) {
        var $this = $(this),
          id = parseInt($this.attr('data-id')),
          type = parseInt($this.attr('data-type')),
          title = $this.attr('data-title'),
          image = $this.attr('data-image');

        activities.push({
          id: id,
          type: type,
          title: title,
          image: image,
        });
      });

      // 更新标题
      $popup
        .find('[data-calendar-modify-new-add-activities-title]')
        .text('修改' + year + '年' + month + '月' + day + '日新添加的内容');
      // 更新内容
      $popup.find('[data-calendar-modify-new-add-activities-content]').html(
        calendarTpl.editModifyNewAddActivityCells.render({
          year: year,
          month: month,
          day: day,
          activities: activities,
        })
      );
      // 更新显示序列号
      $('[data-calendar-modify-new-add-activity-sequence]').map(function(
        index
      ) {
        $(this).text(index + 1);
      });
    },
    // 点击关闭佛历修改新添加条目弹出框
    onClickCalendarModifyNewAddActivitiesPopup: function(e) {
      var $this = $(e.target),
        close =
          !!$this.attr('data-popup-close') ||
          !!$this.attr('data-popup-backdrop') ||
          !!$this.parent().attr('data-popup-close'),
        $modal;

      if (close) {
        $modal = $this.parents('.modal');
        $modal.hide();
        // body恢复滚动
        $('body').css({
          overflow: 'inherit',
        });
      }
    },
    // 点击删除佛历新添加条目
    onClickCalendarModifyNewAddActivitiesDelete: function(e) {
      var self = this,
        $this = $(e.target),
        year = $this.attr('data-year'),
        month = $this.attr('data-month'),
        day = $this.attr('data-day'),
        id = $this.attr('data-id'),
        type = $this.attr('data-type');

      // 删除当前条目
      $this.parents('[data-calendar-modify-new-add-activity-cell]').remove();

      // 删完了，一个不剩，直接删掉编辑区域的对应的单元
      if (!$('[data-calendar-modify-new-add-activity-cell]').length) {
        $(
          '[data-edit-calendar-new-add-cell]' +
            '[data-year="' +
            year +
            '"][data-month="' +
            month +
            '"][data-day="' +
            day +
            '"]'
        ).remove();
      } else {
        // 删掉编辑区域的对应的单元格
        $(
          '[data-edit-calendar-new-add-activity-cell]' +
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
        // 更新显示序列号
        $('[data-calendar-modify-new-add-activity-sequence]').map(function(
          index
        ) {
          $(this).text(index + 1);
        });
      }
    },
    // 佛历组件修改已添加的项目
    onClickCalendarSelectedCellModify: function(e) {
      var self = this,
        $this = $(e.target),
        year = parseInt($this.attr('data-year')),
        month = parseInt($this.attr('data-month')),
        day = parseInt($this.attr('data-day')),
        $selectedCell = $this.parents('[data-edit-calendar-selected-cell]'),
        $activitiesCells = $selectedCell.find(
          '[data-edit-calendar-selected-activity-cell]'
        ),
        // 因为涉及到没有日期的分页与有日期的不分页，所有会有数据重复的问题，更改为上面获取单元格的方式
        //$activitiesCells = $selectedCecll.find('[data-edit-calendar-selected-activity-cell]' +
        //    '[data-year="' + year + '"][data-month="' + month + '"][data-day="' + day + '"]'),
        activities = [],
        $popup = $('[data-calendar-modify-selected-activities-popup]');

      if (!$popup.length) {
        $popup = $(calendarTpl.editModifySelectedActivitiesPopup.render({}));
        $popup.appendTo('body');
      }

      $popup.show();
      // body禁止滚动
      $('body').css({
        overflow: 'hidden',
      });

      $activitiesCells.map(function(index) {
        var $this = $(this),
          id = parseInt($this.attr('data-id')),
          type = parseInt($this.attr('data-type')),
          title = $this.attr('data-title'),
          image = $this.attr('data-image');

        activities.push({
          id: id,
          type: type,
          title: title,
          image: image,
        });
      });

      // 更新标题
      $popup
        .find('[data-calendar-modify-selected-activities-title]')
        .text('修改' + year + '年' + month + '月' + day + '日新添加的内容');
      // 更新内容
      $popup.find('[data-calendar-modify-selected-activities-content]').html(
        calendarTpl.editModifySelectedActivityCells.render({
          year: year,
          month: month,
          day: day,
          activities: activities,
        })
      );
      // 更新显示序列号
      $('[data-calendar-modify-selected-activity-sequence]').map(function(
        index
      ) {
        $(this).text(index + 1);
      });
    },
    // 点击关闭佛历修改已添加条目弹出框
    onClickCalendarModifySelectedActivitiesPopup: function(e) {
      var $this = $(e.target),
        close =
          !!$this.attr('data-popup-close') ||
          !!$this.attr('data-popup-backdrop') ||
          !!$this.parent().attr('data-popup-close'),
        $modal;

      if (close) {
        $modal = $this.parents('.modal');
        $modal.hide();
        // body恢复滚动
        $('body').css({
          overflow: 'inherit',
        });
      }
    },
  });
});
