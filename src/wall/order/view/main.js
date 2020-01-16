import seeAjax from 'see-ajax';
import $ from 'jquery';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
import tpl from '../tpl';
import func from '../function';
import refreshSelectedCount from '../util/refresh_selected_count';
import '../ajax';
import seeView from 'see-view';
seeView({
  events: {
    '!click #action-filter': 'onClickActionFilter',
    '!click #action-reset': 'onClickActionReset',
    '!click [data-tab-type]': 'onClickTabType',
    '!click #select-all': 'onClickSelectAll',
    '!click #action-print': 'onClickActionPrint',
    '!click #printer-popup-ok': 'onClickPrinterPopupOk',
    '!change #filter-house': 'onChangeFilterHouse',
  },
  onClickActionFilter: function(e) {
    var region = parseInt($('#filter-region').val()) || 0,
      startDate = $('#filter-start-date').val(),
      endDate = $('#filter-end-date').val(),
      search = $('#filter-search').val(),
      searchType = parseInt($('#filter-search-type').val());
    if (startDate && endDate) {
      var startDateNumber = parseInt(
        startDate.slice(0, 4) + startDate.slice(5, 7) + startDate.slice(8, 10)
      );
      var endDateNumber = parseInt(
        endDate.slice(0, 4) + endDate.slice(5, 7) + endDate.slice(8, 10)
      );
      if (startDateNumber > endDateNumber) {
        toastr.warning('起始时间不能大于结束时间，请更正');
        return;
      }
    }
    if (data.currentTabType == 1) {
      data.unhandledOrdersFilter.regionId = region;
      data.unhandledOrdersFilter.startDate = startDate;
      data.unhandledOrdersFilter.endDate = endDate;
      data.unhandledOrdersFilter.search = search;
      data.unhandledOrdersFilter.searchType = searchType;
      func.requestUnhandledOrdersList();
    } else {
      data.handledOrdersFilter.regionId = region;
      data.handledOrdersFilter.startDate = startDate;
      data.handledOrdersFilter.endDate = endDate;
      data.handledOrdersFilter.search = search;
      data.handledOrdersFilter.searchType = searchType;
      func.requestHandledOrdersList();
    }
  },
  onClickActionReset: function(e) {
    $('#filter-region').val(0);
    $('#filter-start-date').val('');
    $('#filter-end-date').val('');
    $('#filter-search').val('');
    if (data.currentTabType == 1) {
      data.unhandledOrdersFilter.regionId = 0;
      data.unhandledOrdersFilter.startDate = '';
      data.unhandledOrdersFilter.endDate = '';
      data.unhandledOrdersFilter.search = '';
      func.requestUnhandledOrdersList();
    } else {
      data.handledOrdersFilter.regionId = 0;
      data.handledOrdersFilter.startDate = '';
      data.handledOrdersFilter.endDate = '';
      data.handledOrdersFilter.search = '';
      func.requestHandledOrdersList();
    }
  },
  onClickTabType: function(e) {
    var $this = $(e.currentTarget),
      type = parseInt($this.attr('data-tab-type'));
    var $region = $('#filter-region'),
      $startDate = $('#filter-start-date'),
      $endDate = $('#filter-end-date'),
      $search = $('#filter-search');
    var $actionHandle = $('#action-handle');
    if ($this.hasClass('active')) return;
    $('[data-tab-type]').removeClass('active');
    $this.addClass('active');
    data.currentTabType = type;
    if (data.currentTabType == 1) {
      $region.val(data.unhandledOrdersFilter.regionId);
      $startDate.val(data.unhandledOrdersFilter.startDate);
      $endDate.val(data.unhandledOrdersFilter.endDate);
      $search.val(data.unhandledOrdersFilter.search);
      $actionHandle.show();
      func.requestUnhandledOrdersList();
    } else {
      $region.val(data.handledOrdersFilter.regionId);
      $startDate.val(data.handledOrdersFilter.startDate);
      $endDate.val(data.handledOrdersFilter.endDate);
      $search.val(data.handledOrdersFilter.search);
      $actionHandle.hide();
      func.requestHandledOrdersList();
    }
  },
  onClickSelectAll: function(e) {
    var $this = $(e.currentTarget),
      $selects = $('[data-row-select]');
    if ($this.hasClass('active')) {
      $this.removeClass('active');
      $selects.removeClass('active');
    } else {
      $this.addClass('active');
      $selects.addClass('active');
    }
    refreshSelectedCount();
  },
  onClickActionPrint: function(e) {
    var self = this,
      $selected = $('[data-row-select].active');
    if (!$selected.length) {
      toastr.warning('请先选择要处理的订单');
      return;
    }
    $('#printer-popup').show();
    $('body').addClass('overflow-hidden');
  },
  onClickPrinterPopupOk: function(e) {
    var ids = [];
    $('[data-row-select].active').map(function() {
      ids.push(parseInt($(this).attr('data-row-select')));
    });
    var printers = [];
    $('[data-printer-cell-input]:checked').map(function() {
      printers.push(parseInt($(this).attr('data-printer-cell-input')));
    });
    var printType = parseInt(
      $('[name="printer-popup-print-type"]:checked').attr('value')
    );
    var printPages = parseInt($('#printer-popup-pages').val());
    if (!printers.length) {
      toastr.warning('请至少选择一个打印机');
      return;
    }
    seeAjax(
      'savePrinter',
      {
        ids: JSON.stringify(ids),
        printers: JSON.stringify(printers),
        printType: printType,
        printPages: printPages,
      },
      function(res) {
        if (res.success) {
          $('#printer-popup').hide();
          $('body').removeClass('overflow-hidden');
          if (data.currentTabType === 1) {
            func.requestUnhandledOrdersList();
          } else {
            func.requestHandledOrdersList();
          }
        } else {
          toastr.error(res.message || '网络错误，请稍后再试');
          return;
        }
      }
    );
  },
  onChangeFilterHouse: function(e) {
    var value = $(e.target).val();
    var $selectRegion = $('#filter-region');
    $selectRegion.find('option').map(function() {
      var $this = $(this),
        name = $this.attr('data-name'),
        id = parseInt($this.val());
      if (!id) return;
      if (!value) {
        $this.addClass('hide');
        return;
      }
      if (name.indexOf(value) === 0) $this.removeClass('hide');
      else $this.addClass('hide');
    });
    $selectRegion.val(0);
  },
});
