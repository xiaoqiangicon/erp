import $ from 'jquery';
import fn from 'common/function';
import commonData from './data';
import seeView from 'see-view';
import { renderChart, renderPagination, renderSelectedYear } from './render';

seeView({
  events: {
    'click [data-select-year]': 'onClickSelectYear',
    '!click #action-take': 'onClickActionTake',
    'click [data-dialog-close]': 'onClickDialogClose',
  },
  onClickAvailableDonateTip: function(e) {
    fn.dialog('自在家系统结算周期为31天');
  },
  onClickSelectYear: function(e) {
    var $this = $(e.target),
      year = parseInt($this.attr('data-select-year')),
      currentYear = parseInt(
        $('[data-selected-year]').attr('data-selected-year')
      ),
      $yearContainers = $('[data-year-content]'),
      $targetYearContainer = $('[data-year-content="' + year + '"]'),
      $paginationContentContainers = $('#pagination-content-containers');

    if (year == currentYear) return;
    renderSelectedYear(year);
    $yearContainers.hide();
    if (!$targetYearContainer.length) {
      $targetYearContainer = $(
        commonData.tpl.yearContentContainer.render({
          year: year,
        })
      );
      $paginationContentContainers.append($targetYearContainer);
      $targetYearContainer.html(
        commonData.tpl.paginationContentContainer.render({ year: year })
      );
      commonData.requestList(year, 1);
    } else {
      renderChart({
        year: year,
        months: commonData.monthDataForChart[year],
      });
    }
    $targetYearContainer.show();
  },
  onClickActionTake: function() {
    if (commonData.accountStatus == -1) {
      location.href = '/static/build/cash/account/index.html';
    } else if (commonData.accountStatus === 0) {
      $('#dialog-account-pending').show();
      $('body').addClass('overflow-hidden');
    } else if (commonData.accountStatus === 1) {
      location.href = '/zzhadmin/cashBill/';
    } else if (commonData.accountStatus === 2) {
      $('#dialog-account-no').show();
      $('body').addClass('overflow-hidden');
    }
  },
  onClickDialogClose: function(e) {
    $(e.target)
      .parents('.dialog')
      .hide();
    $('body').removeClass('overflow-hidden');
  },
});
