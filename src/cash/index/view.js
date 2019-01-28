/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'common/function', './data', 'lib/jquery.seeView'], function(
  $,
  fn,
  commonData
) {
  $.seeView({
    events: {
      // 点击可提现的提示
      //'!click #available-donate-tip': 'onClickAvailableDonateTip',
      // 选择某一年
      'click [data-select-year]': 'onClickSelectYear',
      // 点击分页
      'click [data-page-index]': 'onClickPageIndex',
      // 点击申请提现按钮
      '!click #action-take': 'onClickActionTake',
      // 点击关闭对话框
      'click [data-dialog-close]': 'onClickDialogClose',
    },
    // 点击可提现的提示
    onClickAvailableDonateTip: function(e) {
      fn.dialog('自在家系统结算周期为31天');
    },
    // 选择某一年
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

      $.seeBind.setData('data-selected-year', year);

      $yearContainers.hide();
      $paginations.hide();

      // 未请求过
      if (!$targetYearContainer.length) {
        // 创建今天的数据容器
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
        $.seeBind.setData('chart', {
          year: year,
          months: commonData.monthDataForChart[year][currentPage],
        });
      }

      $targetPagination.show();
      $targetYearContainer.show();
    },
    // 点击分页
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

      // 未请求过
      if (!$targetPaginationContent.length) {
        // 创建今天的数据容器
        $targetPaginationContent = $(
          commonData.tpl.paginationContentContainer.render({
            year: year,
            page: page,
          })
        );
        $currentYearContent.append($targetPaginationContent);

        commonData.requestList(year, page);
      } else {
        $.seeBind.setData('chart', {
          year: year,
          months: commonData.monthDataForChart[year][page],
        }),
          $.seeBind.setData(
            'pagination',
            {
              currentPage: page,
              totalPages: totalPages,
              year: year,
            },
            { year: year }
          );
      }

      $targetPaginationContent.show();
    },
    // 点击申请提现按钮
    onClickActionTake: function() {
      // 未提交过账户申请
      if (commonData.accountStatus == -1) {
        location.href = '/static/dist/html/cash/account/index.html';
      }
      // 正在审核
      else if (commonData.accountStatus === 0) {
        $('#dialog-account-pending').show();
        $('body').addClass('overflow-hidden');
      }
      // 审核通过
      else if (commonData.accountStatus === 1) {
        location.href = '/zzhadmin/cashBill/';
      }
      // 审核不通过
      else if (commonData.accountStatus === 2) {
        $('#dialog-account-no').show();
        $('body').addClass('overflow-hidden');
      }
    },
    // 点击关闭对话框
    onClickDialogClose: function(e) {
      $(e.target)
        .parents('.dialog')
        .hide();
      $('body').removeClass('overflow-hidden');
    },
  });
});
