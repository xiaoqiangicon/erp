/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'common/function', './data', 'lib/jquery.seeView'], function(
  $,
  fn,
  commonData
) {
  var specialDateIntervals = [0, 1, 3, 12];

  $.seeView({
    events: {
      // 时间选择变化
      'change [data-select-date]': 'onChangeSelectDate',
      // 点击分页
      'click [data-page-index]': 'onClickPageIndex',
      // 点击特殊日期，今天，3个月，一年
      'click [data-special-date]': 'onClickSpecialDate',
      // 点击查看详情
      'click [data-detail-unit-more]': 'onClickDetailUnitMore',
      // 点击弹出框
      'click [data-popup]': 'onClickPopup',
      // 点击导出Excel
      'click #export-excel': 'onClickExportExcel',
    },
    // 选择某一年
    onChangeSelectDate: function(e) {
      var self = this,
        $this = $(e.target),
        $startDate = $('[data-select-date="1"]'),
        $endDate = $('[data-select-date="2"]'),
        startDate = $startDate.val(),
        startDateInt = !!startDate && commonData.getDateInt(startDate),
        endDate = $endDate.val(),
        endDateInt = !!endDate && commonData.getDateInt(endDate);

      if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
        fn.dialog('您选择的开始时间大于了结束时间，请重新选取');
        return;
      }

      self.switchDate(startDate, endDate);
    },
    // 点击特殊日期，今天，3个月，一年
    onClickSpecialDate: function(e) {
      var self = this,
        $this = $(e.target),
        type = parseInt($this.attr('data-special-date')),
        endDate = commonData.today.display,
        startDate = commonData.getDateStartFromToday(
          specialDateIntervals[type - 1]
        );

      $.seeBind.setData('data-select-date', startDate, { index: 1 });
      $.seeBind.setData('data-select-date', endDate, { index: 2 });
      self.switchDate(startDate, endDate);
    },
    // 切换时间
    switchDate: function(startDate, endDate) {
      var $dateContainers = $('[data-date-content]'),
        $targetDateContainer = $(
          '[data-date-content]' +
            '[data-start-date="' +
            startDate +
            '"][data-end-date="' +
            endDate +
            '"]'
        ),
        $paginations = $('[data-pagination]'),
        $targetPagination = $(
          '[data-pagination]' +
            '[data-start-date="' +
            startDate +
            '"][data-end-date="' +
            endDate +
            '"]'
        ),
        $paginationContentContainers = $('#pagination-content-containers'),
        $paginationContainers = $('#pagination-containers');

      $dateContainers.hide();
      $paginations.hide();

      // 未请求过
      if (!$targetDateContainer.length) {
        // 创建今天的数据容器
        $targetDateContainer = $(
          commonData.tpl.dateContentContainer.render({
            startDate: startDate,
            endDate: endDate,
          })
        );
        $targetPagination = $(
          commonData.tpl.paginationContainer.render({
            startDate: startDate,
            endDate: endDate,
          })
        );
        $paginationContentContainers.append($targetDateContainer);
        $paginationContainers.append($targetPagination);
        $targetDateContainer.html(
          commonData.tpl.paginationContentContainer.render({
            page: 1,
            startDate: startDate,
            endDate: endDate,
          })
        );

        commonData.requestList(startDate, endDate, 1);
      }

      $targetPagination.show();
      $targetDateContainer.show();
    },
    // 点击分页
    onClickPageIndex: function(e) {
      var $this = $(e.target),
        startDate = $this.attr('data-start-date'),
        endDate = $this.attr('data-end-date'),
        page = parseInt($this.attr('data-page-index')),
        currentPage = parseInt($this.attr('data-current-page')),
        totalPages = parseInt($this.attr('data-total-pages')),
        $pagination = $(
          '[data-pagination]' +
            '[data-start-date="' +
            startDate +
            '"][data-end-date="' +
            endDate +
            '"]'
        ),
        $paginationContents = $(
          '[data-pagination-content]' +
            '[data-start-date="' +
            startDate +
            '"][data-end-date="' +
            endDate +
            '"]'
        ),
        $currentDateContent = $(
          '[data-date-content]' +
            '[data-start-date="' +
            startDate +
            '"][data-end-date="' +
            endDate +
            '"]'
        ),
        $targetPaginationContent = $(
          '[data-pagination-content="' +
            page +
            '"]' +
            '[data-start-date="' +
            startDate +
            '"][data-end-date="' +
            endDate +
            '"]'
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
            startDate: startDate,
            endDate: endDate,
            page: page,
          })
        );
        $currentDateContent.append($targetPaginationContent);

        commonData.requestList(startDate, endDate, page);
      } else {
        $.seeBind.setData(
          'pagination',
          {
            currentPage: page,
            totalPages: totalPages,
            startDate: startDate,
            endDate: endDate,
          },
          { startDate: startDate, endDate: endDate }
        );
      }

      $targetPaginationContent.show();
    },
    // 点击查看详情
    onClickDetailUnitMore: function(e) {
      var $this = $(e.target),
        orderId = $this.attr('data-detail-unit-more'),
        $popup = $('[data-popup="' + orderId + '"]');

      if (!$popup.length) {
        ($popup = commonData.tpl.popup.render(commonData.orderInfo[orderId])),
          $('body').append($popup);
      } else $popup.show();
    },
    // 点击弹出框
    onClickPopup: function(e) {
      var $this = $(e.target),
        $popup = $this.parents('[data-popup]'),
        canClose =
          !!$this.attr('data-popup-close') ||
          !!$this.attr('data-popup-overlay');

      canClose && $popup.hide();
    },
    // 点击导出Excel
    onClickExportExcel: function(e) {
      var $startDate = $('[data-select-date="1"]'),
        $endDate = $('[data-select-date="2"]'),
        startDate = $startDate.val(),
        startDateInt = !!startDate && commonData.getDateInt(startDate),
        endDate = $endDate.val(),
        endDateInt = !!endDate && commonData.getDateInt(endDate);

      if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
        fn.dialog('您选择的开始时间大于了结束时间，请重新选取');
        return;
      }

      window.open(
        '/zzhadmin/getTransactionRecordExcel/?startTime=' +
          startDate +
          '&endTime=' +
          endDate
      );
    },
  });
});
