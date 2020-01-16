import $ from 'jquery';
function postHandleForDonateChart($displayComponent, $editContainer, data) {
  var id = data.id,
    $items = $displayComponent.find('[data-donate-chart-items]');
  $displayComponent.find('[data-donate-chart-title-display]').text(data.title);
  $editContainer.find('[data-donate-chart-title]').val(data.title);
  $editContainer.find('[data-donate-chart-items-count]').val(data.itemsCount);
  $items.map(function(index) {
    index < data.itemsCount
      ? $(this).css({
          display: 'table',
        })
      : $(this).hide();
  });
  var $realTimeCheckbox = $('[data-edit-donate-chart-type][data-index="1"]'),
    realTimeActive = data.showRealTimeList,
    $monthCheckbox = $('[data-edit-donate-chart-type][data-index="2"]'),
    monthActive = data.showMonthList,
    $totalCheckbox = $('[data-edit-donate-chart-type][data-index="3"]'),
    totalActive = data.showTotalList;
  $realTimeCheckbox.prop({
    checked: realTimeActive,
  });
  $monthCheckbox.prop({
    checked: monthActive,
  });
  $totalCheckbox.prop({
    checked: totalActive,
  });
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
}
export default postHandleForDonateChart;
