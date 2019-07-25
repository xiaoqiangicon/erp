/**
 * Created by senntyou on 2017/2/27.
 */

define(['jquery'], function($) {
  // 添加功德榜组件后事件添加
  function postHandleForDonateChart($displayComponent, $editContainer, data) {
    var id = data.id,
      $items = $displayComponent.find('[data-donate-chart-items]');

    // 更新标题到展示组件
    $displayComponent
      .find('[data-donate-chart-title-display]')
      .text(data.title);
    // 更新标题到编辑组件
    $editContainer.find('[data-donate-chart-title]').val(data.title);

    // 更新条数到编辑组件
    $editContainer.find('[data-donate-chart-items-count]').val(data.itemsCount);

    $items.map(function(index) {
      /**
       * mark-1: 兼容操蛋的360浏览器
       */
      //index < data.itemsCount ? $(this).show() : $(this).hide();
      /**
       * mark-1: end
       */

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

    // 实时显示与否
    if (!realTimeActive) {
      $('[data-display-donate-chart-type][data-index="1"]').hide();
    } else {
      $('[data-display-donate-chart-type][data-index="1"]').css({
        display: 'inline',
      });
    }

    // 月榜显示与否
    if (!monthActive) {
      $('[data-display-donate-chart-type][data-index="2"]').hide();
    } else {
      $('[data-display-donate-chart-type][data-index="2"]').css({
        display: 'inline',
      });
    }

    // 总榜显示与否
    if (!totalActive) {
      $('[data-display-donate-chart-type][data-index="3"]').hide();
    } else {
      $('[data-display-donate-chart-type][data-index="3"]').css({
        display: 'inline',
      });
    }

    // 第一条分隔线显示与否
    if (realTimeActive && (monthActive || totalActive)) {
      $('[data-display-donate-chart-type-devider][data-index="1"]').css({
        display: 'inline',
      });
    } else {
      $('[data-display-donate-chart-type-devider][data-index="1"]').hide();
    }

    // 第二条分隔线显示与否
    if (monthActive && totalActive) {
      $('[data-display-donate-chart-type-devider][data-index="2"]').css({
        display: 'inline',
      });
    } else {
      $('[data-display-donate-chart-type-devider][data-index="2"]').hide();
    }
  }

  return postHandleForDonateChart;
});
