/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  'common/variables',
  './data',
  './tpl',
  './function',
  'clipboard',
  '@zzh/jquery-qrcode',
  './ajax',
  'lib/jquery.seeView',
], function($, commonFunc, commonVars, data, tpl, func, Clipboard) {
  $.seeView({
    events: {
      // 点击分页
      'click [data-pagination-index]': 'onClickPaginationIndex',
      // 点击查询按钮
      'click #filter-submit': 'onClickFilterSubmit',
      // 点击推广按钮
      'click #promotion': 'onClickPromotion',
      // 点击弹出框
      'click [data-popup]': 'onClickPopup',
      // 点击切换二维码
      'click [data-switch-qrcode]': 'onClickSwitchQrcode',
      // 点击导出
      'click #export': 'onClickExport',
    },
    // 点击分页
    onClickPaginationIndex: function(e) {
      var $this = $(e.target),
        currentPage = parseInt($this.attr('data-current-page')),
        pageIndex = parseInt($this.attr('data-pagination-index')),
        startDate = $this.attr('data-start-date'),
        endDate = $this.attr('data-end-date'),
        page =
          pageIndex == -1
            ? currentPage - 1
            : pageIndex == -2
            ? currentPage + 1
            : pageIndex,
        totalPages = data.totalPagesRecord['date:' + startDate + ':' + endDate];

      var $parentContentContainer = $(
          '[data-container="date-content"][data-start-date="' +
            startDate +
            '"]' +
            '[data-end-date="' +
            endDate +
            '"]'
        ),
        $contentContainers = $parentContentContainer.find(
          '[data-container="pagination-content"]'
        ),
        $currentContentContainer = $parentContentContainer.find(
          '[data-container="pagination-content"]' +
            '[data-page-index="' +
            page +
            '"]'
        ),
        $paginationContainer = $(
          '[data-container="pagination"][data-start-date="' +
            startDate +
            '"][data-end-date="' +
            endDate +
            '"]'
        );

      $contentContainers.hide();

      if (!$currentContentContainer.length) {
        $currentContentContainer = $(
          tpl.paginationContentContainer.render({
            pageIndex: page,
          })
        );
        $parentContentContainer.append($currentContentContainer);
        func.requestList(page, startDate, endDate);
      } else {
        $currentContentContainer.show();
        $paginationContainer.html(
          tpl.pagination.render({
            currentPage: page,
            nextPage: !!totalPages && page >= totalPages ? 0 : page + 1,
            startDate: startDate,
            endDate: endDate,
          })
        );
      }
    },
    // 点击查询按钮
    onClickFilterSubmit: function(e) {
      var $startDate = $('#filter-start-date'),
        startDate = $startDate.val(),
        startDateInt =
          !!startDate &&
          parseInt(
            startDate.slice(0, 4) +
              startDate.slice(5, 7) +
              startDate.slice(8, 10)
          ),
        $endDate = $('#filter-end-date'),
        endDate = $endDate.val(),
        endDateInt =
          !!endDate &&
          parseInt(
            endDate.slice(0, 4) + endDate.slice(5, 7) + endDate.slice(8, 10)
          ),
        $dateContentContainers = $('[data-container="date-content"]'),
        $currentDateContentContainer = $(
          '[data-container="date-content"][data-start-date="' +
            startDate +
            '"]' +
            '[data-end-date="' +
            endDate +
            '"]'
        ),
        $paginationContainers = $('[data-container="pagination"]'),
        $currentPaginationContainer = $(
          '[data-container="pagination"][data-start-date="' +
            startDate +
            '"][data-end-date="' +
            endDate +
            '"]'
        );

      if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
        $.alert({
          title: false,
          content: '您选择的起始时间大于了结束时间，请重新选择',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        return;
      }

      $dateContentContainers.hide();
      $paginationContainers.hide();
      if (!$currentDateContentContainer.length) {
        $currentDateContentContainer = $(
          tpl.dateContentContainer.render({
            startDate: startDate,
            endDate: endDate,
          })
        );
        $('#date-content-containers').append($currentDateContentContainer);
        $currentPaginationContainer = $(
          tpl.paginationContainer.render({
            startDate: startDate,
            endDate: endDate,
          })
        );
        $('#pagination-containers').append($currentPaginationContainer);
        func.requestList(1, startDate, endDate);
      }
      $currentDateContentContainer.show();
      $currentPaginationContainer.show();
    },
    // 点击推广按钮
    onClickPromotion: function(e) {
      var $promotionPopup = $('#promotion-popup');

      if (!$promotionPopup.length) {
        $promotionPopup = $(
          tpl.promotionPopup.render({
            link: data.shareLink,
          })
        );
        $('body').append($promotionPopup);
        // 添加复制
        new Clipboard('[data-clipboard-target]');
        // 二维码
        $('#website-url-qrcode-container').qrcode({
          width: data.qrcodeSizes[0],
          height: data.qrcodeSizes[0],
          text: data.shareLink,
        });
      } else {
        $promotionPopup.show();
      }
    },
    // 点击弹出框
    onClickPopup: function(e) {
      var $this = $(e.target),
        close =
          !!$this.attr('data-popup-close') ||
          !!$this.attr('data-popup-overlay');

      if (close) {
        $(e.currentTarget).hide();
      }
    },
    // 点击切换二维码
    onClickSwitchQrcode: function(e) {
      var $this = $(e.target),
        type = parseInt($this.attr('data-type'));
      if ($this.hasClass('active')) return;

      $('[data-switch-qrcode].active').removeClass('active');
      $this.addClass('active');
      $('#website-url-qrcode-container').html('');
      $('#website-url-qrcode-container').qrcode({
        width: data.qrcodeSizes[type - 1],
        height: data.qrcodeSizes[type - 1],
        text: data.shareLink,
      });
    },
    // 点击导出
    onClickExport: function(e) {
      var $startDate = $('#filter-start-date'),
        startDate = $startDate.val(),
        startDateInt =
          !!startDate &&
          parseInt(
            startDate.slice(0, 4) +
              startDate.slice(5, 7) +
              startDate.slice(8, 10)
          ),
        $endDate = $('#filter-end-date'),
        endDate = $endDate.val(),
        endDateInt =
          !!endDate &&
          parseInt(
            endDate.slice(0, 4) + endDate.slice(5, 7) + endDate.slice(8, 10)
          );

      if (!!startDateInt && !!endDateInt && startDateInt > endDateInt) {
        $.alert({
          title: false,
          content: '您选择的起始时间大于了结束时间，请重新选择',
          buttons: { ok: { text: '确定' } },
          theme: 'white',
        });
        return;
      }

      window.open(
        '/zzhadmin/meritBoxDownloadExcel/?startTime=' +
          startDate +
          '&endTime=' +
          endDate
      );
    },
  });
});