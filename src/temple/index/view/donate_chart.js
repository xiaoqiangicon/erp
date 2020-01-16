import $ from 'jquery';
import seeView from 'see-view';
seeView({
  events: {
    'keyup [data-donate-chart-title]': 'onKeyUpInDonateChartTitle',
    'change [data-donate-chart-items-count]': 'onChangeInDonateChartItemsCount',
    'change [data-edit-donate-chart-type]': 'onChangeEditDonateChartType',
  },
  onKeyUpInDonateChartTitle: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-donate-chart-title')),
      value = $this.val().trim();
    $('[data-donate-chart-title-display="' + id + '"]').text(value);
  },
  onChangeInDonateChartItemsCount: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-donate-chart-items-count')),
      count = parseInt($this.val()),
      $items = $('[data-donate-chart-items="' + id + '"]');
    $items.map(function(index) {
      index < count
        ? $(this).css({
            display: 'table',
          })
        : $(this).hide();
    });
  },
  onChangeEditDonateChartType: function(e) {
    var self = this,
      $this = $(e.target),
      $realTimeCheckbox = $('[data-edit-donate-chart-type][data-index="1"]'),
      realTimeActive = $realTimeCheckbox.prop('checked'),
      $monthCheckbox = $('[data-edit-donate-chart-type][data-index="2"]'),
      monthActive = $monthCheckbox.prop('checked'),
      $totalCheckbox = $('[data-edit-donate-chart-type][data-index="3"]'),
      totalActive = $totalCheckbox.prop('checked');
    if (!realTimeActive) {
      $('[data-display-donate-chart-type][data-index="1"]').hide();
    } else {
      $('[data-display-donate-chart-type][data-index="1"]').css({
        display: 'inline',
      });
    }
    if (!monthActive) {
      $('[data-display-donate-chart-type][data-index="2"]').hide();
    } else {
      $('[data-display-donate-chart-type][data-index="2"]').css({
        display: 'inline',
      });
    }
    if (!totalActive) {
      $('[data-display-donate-chart-type][data-index="3"]').hide();
    } else {
      $('[data-display-donate-chart-type][data-index="3"]').css({
        display: 'inline',
      });
    }
    if (realTimeActive && (monthActive || totalActive)) {
      $('[data-display-donate-chart-type-devider][data-index="1"]').css({
        display: 'inline',
      });
    } else {
      $('[data-display-donate-chart-type-devider][data-index="1"]').hide();
    }
    if (monthActive && totalActive) {
      $('[data-display-donate-chart-type-devider][data-index="2"]').css({
        display: 'inline',
      });
    } else {
      $('[data-display-donate-chart-type-devider][data-index="2"]').hide();
    }
  },
});
