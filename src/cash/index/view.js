import $ from 'jquery';
import fn from 'common/function';
import commonData from './data';
import seeView from 'see-view';
import { renderChart, renderPagination, renderSelectedYear } from './render';

seeView({
  events: {
    'click [data-select-year]': 'onClickSelectYear',
    'click [data-page-index]': 'onClickPageIndex',
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
      $paginations = $('[data-pagination]'),
      $targetPagination = $('[data-pagination="' + year + '"]'),
      $paginationContentContainers = $('#pagination-content-containers'),
      $paginationContainers = $('#pagination-containers');
    var currentPage;
    if (year == currentYear) return;
    renderSelectedYear(year);
    $yearContainers.hide();
    $paginations.hide();
    if (!$targetYearContainer.length) {
      $targetYearContainer = $(
        commonData.tpl.yearContentContainer.render({
          year: year,
        })
      );
      $targetPagination = $(
        commonData.tpl.paginationContainer.render({
          year: year,
        })
      );
      $paginationContentContainers.append($targetYearContainer);
      $paginationContainers.append($targetPagination);
      $targetYearContainer.html(
        commonData.tpl.paginationContentContainer.render({
          page: 1,
          year: year,
        })
      );
      commonData.requestList(year, 1);
    } else {
      currentPage = parseInt(
        $('[data-page-index][data-year="' + year + '"].active').attr(
          'data-page-index'
        )
      );
      renderChart({
        year: year,
        months: commonData.monthDataForChart[year][currentPage],
      });
    }
    $targetPagination.show();
    $targetYearContainer.show();
  },
  onClickPageIndex: function(e) {
    var $this = $(e.target),
      year = parseInt($this.attr('data-year')),
      page = parseInt($this.attr('data-page-index')),
      currentPage = parseInt($this.attr('data-current-page')),
      totalPages = parseInt($this.attr('data-total-pages')),
      $pagination = $('[data-pagination="' + year + '"]'),
      $paginationContents = $(
        '[data-pagination-content][data-year="' + year + '"]'
      ),
      $currentYearContent = $('[data-year-content="' + year + '"]'),
      $targetPaginationContent = $(
        '[data-pagination-content="' + page + '"][data-year="' + year + '"]'
      );
    if ($this.hasClass('active')) return;
    if (page == -1) page = currentPage - 1;
    else if (page == -2) page = currentPage + 1;
    $paginationContents.hide();
    if (!$targetPaginationContent.length) {
      $targetPaginationContent = $(
        commonData.tpl.paginationContentContainer.render({
          year: year,
          page: page,
        })
      );
      $currentYearContent.append($targetPaginationContent);
      commonData.requestList(year, page);
    } else {
      renderChart({
        year: year,
        months: commonData.monthDataForChart[year][page],
      });
      renderPagination(
        {
          currentPage: page,
          totalPages: totalPages,
          year: year,
        },
        {
          year: year,
        }
      );
    }
    $targetPaginationContent.show();
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
