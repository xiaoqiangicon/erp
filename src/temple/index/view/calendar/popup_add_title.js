import $ from 'jquery';
import indexData from '../../data';
import commonTpl from '../../tpl/common';
import calendarTpl from '../../tpl/calendar';
import 'lib/bootstrap-material-datetimepicker';
import 'jquery-confirm';
import 'lib/jquery.seeView';
$.seeView({
  events: {
    'click [data-calendar-new-title-content-cell-delete]':
      'onClickCalendarNewTitleContentCellDelete',
    'click [data-calendar-new-title-ok]': 'onClickCalendarNewTitleOk',
    'click [data-calendar-new-title-popup]': 'onClickCalendarNewTitlePopup',
  },
  onClickCalendarNewTitleContentCellDelete: function(e) {
    $(e.target)
      .parent()
      .remove();
  },
  onClickCalendarNewTitleOk: function(e) {
    var self = this,
      $contentContainer = $('[data-calendar-new-title-content]'),
      $input = $('[data-calendar-new-title-input]'),
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
    var newTitleId;
    !!inputValue &&
      inputValue.trim() &&
      ((inputValue = inputValue.trim()),
      Object.keys(indexData.calendarNewAddedTitle).map(function(key) {
        if (indexData.calendarNewAddedTitle[key] == inputValue) {
          newTitleId = parseInt(key);
          return !1;
        }
      }),
      !newTitleId &&
        ((newTitleId = indexData.calendarNewAddedTitleId++),
        (indexData.calendarNewAddedTitle[newTitleId] = inputValue)),
      items.push({
        id: newTitleId,
        content: inputValue,
      }));
    $contentContainer.html('');
    $input.val('');
    $('[data-calendar-new-title-popup]').hide();
    self.renderAddedCalendarBuddhistItems(items);
  },
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
  onClickCalendarNewTitlePopup: function(e) {
    var $this = $(e.target),
      close =
        !!$this.attr('data-popup-close') ||
        !!$this.attr('data-popup-backdrop') ||
        !!$this.parent().attr('data-popup-close'),
      $modal,
      $contentContainer = $('[data-calendar-new-title-content]'),
      $input = $('[data-calendar-new-title-input]');
    if (close) {
      $modal = $this.parents('.modal');
      $modal.hide();
      $contentContainer.html('');
      $input.val('');
    }
  },
});
