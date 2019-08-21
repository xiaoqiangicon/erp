import $ from 'jquery';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import func from './function';
import './ajax';
import seeView from 'see-view';
toastr.options.positionClass = 'toast-bottom-full-width';
toastr.options.timeOut = 2000;
seeView({
  events: {
    '!click #action-filter': 'onClickActionFilter',
    '!click #action-reset': 'onClickActionReset',
    '!click [data-tab-type]': 'onClickTabType',
    '!click #select-all': 'onClickSelectAll',
    'click [data-row-select]': 'onClickRowSelect',
    '!click #action-send': 'onClickActionSend',
    'click [data-row-send]': 'onClickRowSend',
    '!click #go-to-charge': 'onClickGoToChange',
    'click [data-popup-close]': 'onClickPopupClose',
    'click [data-page-index]': 'onClickPageIndex',
    '!click #send-popup-submit': 'onClickSendPopupSubmit',
    '!keyup #send-popup-input': 'onKeyupSendPopupInput',
  },
  onClickActionFilter: function(e) {
    var $region = $('#filter-region'),
      region = parseInt($region.val()) || 0,
      $remainDays = $('#filter-remain-days'),
      remainDays = parseInt($remainDays.val());
    isNaN(remainDays) && (remainDays = '');
    if (data.currentTabType == 1) {
      data.onlineOrdersFilter.regionId = region;
      data.onlineOrdersFilter.remainDays = remainDays;
      func.requestOnlineOrdersList();
    } else {
      data.customOrdersFilter.regionId = region;
      data.customOrdersFilter.remainDays = remainDays;
      func.requestCustomOrdersList();
    }
  },
  onClickActionReset: function(e) {
    $('#filter-region').val(0);
    $('#filter-remain-days').val('');
    if (data.currentTabType == 1) {
      data.onlineOrdersFilter.regionId = 0;
      data.onlineOrdersFilter.remainDays = '';
      func.requestOnlineOrdersList();
    } else {
      data.customOrdersFilter.regionId = 0;
      data.customOrdersFilter.remainDays = '';
      func.requestCustomOrdersList();
    }
  },
  onClickTabType: function(e) {
    var $this = $(e.currentTarget),
      type = parseInt($this.attr('data-tab-type'));
    var $region = $('#filter-region'),
      $remainDays = $('#filter-remain-days');
    if ($this.hasClass('active')) return;
    $('[data-tab-type]').removeClass('active');
    $this.addClass('active');
    data.currentTabType = type;
    if (data.currentTabType == 1) {
      $region.val(data.onlineOrdersFilter.regionId);
      $remainDays.val(data.onlineOrdersFilter.remainDays);
      func.requestOnlineOrdersList();
    } else {
      $region.val(data.customOrdersFilter.regionId);
      $remainDays.val(data.customOrdersFilter.remainDays);
      func.requestCustomOrdersList();
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
  },
  onClickRowSelect: function(e) {
    var $this = $(e.currentTarget);
    $this.toggleClass('active');
    this.checkSelectAllStatus();
  },
  checkSelectAllStatus: function() {
    var allSelected =
        $('[data-row-select]').length == $('[data-row-select].active').length,
      $selectAll = $('#select-all');
    if (allSelected) $selectAll.addClass('active');
    else $selectAll.removeClass('active');
  },
  onClickActionSend: function(e) {
    var $selected = $('[data-row-select].active');
    if (!$selected.length) {
      toastr.warning('请先选择要发送短信的订单');
      return;
    }
    var ids = [];
    $selected.map(function() {
      ids.push(parseInt($(this).attr('data-row-select')));
    });
    $.seeAjax.post(
      'getSendInfo',
      {
        type: data.currentTabType,
        ids: ids,
      },
      function(res) {
        if (res.success) {
          func.showSendPopup(res, function(content) {
            $.seeAjax.post(
              'send',
              {
                type: data.currentTabType,
                ids: ids,
                content: content,
              },
              function(res) {
                if (res.success) {
                  var $remainCount = $('#remain-message-count');
                  $remainCount.text(parseInt($remainCount.text()) - ids.length);
                  ids.map(function(id) {
                    var $count = $('[data-row-send-count="' + id + '"]');
                    $count.text(parseInt($count.text()) + 1);
                  });
                  toastr.success('短信发送成功');
                } else {
                  toastr.error(res.message || '短信发送失败，请稍后再试');
                }
              },
              !0
            );
          });
        }
      },
      !0
    );
  },
  onClickRowSend: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-row-send')),
      ids = [id];
    $.seeAjax.post(
      'getSendInfo',
      {
        type: data.currentTabType,
        ids: ids,
      },
      function(res) {
        if (res.success) {
          func.showSendPopup(res, function(content) {
            $.seeAjax.post(
              'send',
              {
                type: data.currentTabType,
                ids: ids,
                content: content,
              },
              function(res) {
                if (res.success) {
                  var $remainCount = $('#remain-message-count');
                  $remainCount.text(parseInt($remainCount.text()) - 1);
                  var $count = $('[data-row-send-count="' + id + '"]');
                  $count.text(parseInt($count.text()) + 1);
                  toastr.success('短信发送成功');
                } else {
                  toastr.error(res.message || '短信发送失败，请稍后再试');
                }
              },
              !0
            );
          });
        }
      },
      !0
    );
  },
  onClickGoToChange: function(e) {
    $('#charge-popup').show();
  },
  onClickPopupClose: function(e) {
    $(e.target)
      .parents('.modal')
      .hide();
  },
  onClickPageIndex: function(e) {
    var $this = $(e.target),
      currentPage = parseInt($this.attr('data-current-page')),
      pageIndex = parseInt($this.attr('data-page-index')),
      page =
        pageIndex == -1
          ? currentPage - 1
          : pageIndex == -2
          ? currentPage + 1
          : pageIndex;
    if (data.currentTabType == 1) {
      func.requestOnlineOrdersList(page);
    } else {
      func.requestCustomOrdersList(page);
    }
  },
  onClickSendPopupSubmit: function(e) {
    var inputValue = $('#send-popup-input').val();
    data.sendPopupSubmitCallback && data.sendPopupSubmitCallback(inputValue);
    $('#send-popup').hide();
  },
  onKeyupSendPopupInput: function() {
    $('#send-popup-input-count').text($('#send-popup-input').val().length);
  },
});
