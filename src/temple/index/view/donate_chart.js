/**
 * Created by senntyou on 2017/2/27.
 */
define(['jquery', 'lib/jquery.seeView'], function($) {
  $.seeView({
    events: {
      // 功德榜组件的标题
      'keyup [data-donate-chart-title]': 'onKeyUpInDonateChartTitle',
      // 功德榜组件的条数
      'change [data-donate-chart-items-count]':
        'onChangeInDonateChartItemsCount',
      // 点击功德榜榜单选项
      'change [data-edit-donate-chart-type]': 'onChangeEditDonateChartType',
    },
    // 功德榜组件的标题
    onKeyUpInDonateChartTitle: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-donate-chart-title')),
        value = $this.val().trim();
      $('[data-donate-chart-title-display="' + id + '"]').text(value);
    },
    // 功德榜组件的条数
    onChangeInDonateChartItemsCount: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-donate-chart-items-count')),
        count = parseInt($this.val()),
        $items = $('[data-donate-chart-items="' + id + '"]');

      $items.map(function(index) {
        /**
         * mark-1: 兼容操蛋的360浏览器
         */
        //index < count ? $(this).show() : $(this).hide();
        /**
         * mark-1: end
         */

        index < count
          ? $(this).css({
              display: 'table',
            })
          : $(this).hide();
      });
    },
    // 点击功德榜榜单选项
    onChangeEditDonateChartType: function(e) {
      var self = this,
        $this = $(e.target),
        $realTimeCheckbox = $('[data-edit-donate-chart-type][data-index="1"]'),
        realTimeActive = $realTimeCheckbox.prop('checked'),
        $monthCheckbox = $('[data-edit-donate-chart-type][data-index="2"]'),
        monthActive = $monthCheckbox.prop('checked'),
        $totalCheckbox = $('[data-edit-donate-chart-type][data-index="3"]'),
        totalActive = $totalCheckbox.prop('checked');

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
    },
  });
});
