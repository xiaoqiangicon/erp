import $ from 'jquery';
import indexData from '../../data';
import commonTpl from '../../tpl/common';
import calendarTpl from '../../tpl/calendar';
import 'lib/bootstrap-material-datetimepicker';
import 'jquery-confirm';
import 'lib/jquery.seeView';
$.seeView({
  events: {
    'click [data-calendar-popup]': 'onClickCalendarPopup',
    'click [data-calendar-popup-ok]': 'onClickCalendarPopupOk',
    'click [data-edit-calendar-new-add-cell-modify]':
      'onClickCalendarNewAddCellModify',
    'click [data-calendar-modify-new-add-activities-popup]':
      'onClickCalendarModifyNewAddActivitiesPopup',
    'click [data-calendar-modify-new-add-activity-delete]':
      'onClickCalendarModifyNewAddActivitiesDelete',
    'click [data-edit-calendar-selected-cell-modify]':
      'onClickCalendarSelectedCellModify',
    'click [data-calendar-modify-selected-activities-popup]':
      'onClickCalendarModifySelectedActivitiesPopup',
  },
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
      $('body').css({
        overflow: 'inherit',
      });
      $dateContainer.html('');
      $contentContainer.html('');
    }
  },
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
        buttons: {
          ok: {
            text: '确定',
          },
        },
        theme: 'white',
      });
      return;
    }
    if (!$activities.length) {
      $.alert({
        title: false,
        content: '您还没有添加活动，请添加佛事或新建标题',
        buttons: {
          ok: {
            text: '确定',
          },
        },
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
    $('[data-calendar-popup-date-container]').html('');
    $('[data-calendar-popup-activity-container]').html('');
    $modal.hide();
    $('body').css({
      overflow: 'inherit',
    });
    self.onCalendarDatesAndActivitiesSelected(items);
  },
  onCalendarDatesAndActivitiesSelected: function(items) {
    var self = this,
      $contentContainer = $('[data-edit-calendar-new-add-content]'),
      $unitContainer,
      $unitActivitiesContainer,
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
      if (!$unitContainer.length) {
        unitItems = {
          year: date.year,
          month: date.month,
          day: date.day,
          activities: items.activities,
        };
        $contentContainer.append(calendarTpl.editNewAddUnit.render(unitItems));
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
    $popup
      .find('[data-calendar-modify-new-add-activities-title]')
      .text('修改' + year + '年' + month + '月' + day + '日新添加的内容');
    $popup.find('[data-calendar-modify-new-add-activities-content]').html(
      calendarTpl.editModifyNewAddActivityCells.render({
        year: year,
        month: month,
        day: day,
        activities: activities,
      })
    );
    $('[data-calendar-modify-new-add-activity-sequence]').map(function(index) {
      $(this).text(index + 1);
    });
  },
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
      $('body').css({
        overflow: 'inherit',
      });
    }
  },
  onClickCalendarModifyNewAddActivitiesDelete: function(e) {
    var self = this,
      $this = $(e.target),
      year = $this.attr('data-year'),
      month = $this.attr('data-month'),
      day = $this.attr('data-day'),
      id = $this.attr('data-id'),
      type = $this.attr('data-type');
    $this.parents('[data-calendar-modify-new-add-activity-cell]').remove();
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
      $('[data-calendar-modify-new-add-activity-sequence]').map(function(
        index
      ) {
        $(this).text(index + 1);
      });
    }
  },
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
      activities = [],
      $popup = $('[data-calendar-modify-selected-activities-popup]');
    if (!$popup.length) {
      $popup = $(calendarTpl.editModifySelectedActivitiesPopup.render({}));
      $popup.appendTo('body');
    }
    $popup.show();
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
    $popup
      .find('[data-calendar-modify-selected-activities-title]')
      .text('修改' + year + '年' + month + '月' + day + '日新添加的内容');
    $popup.find('[data-calendar-modify-selected-activities-content]').html(
      calendarTpl.editModifySelectedActivityCells.render({
        year: year,
        month: month,
        day: day,
        activities: activities,
      })
    );
    $('[data-calendar-modify-selected-activity-sequence]').map(function(index) {
      $(this).text(index + 1);
    });
  },
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
      $('body').css({
        overflow: 'inherit',
      });
    }
  },
});
