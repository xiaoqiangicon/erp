/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'toastr',
  'common/function',
  'common/variables',
  './data',
  './tpl',
  './function',
  './ajax',
  'lib/jquery.seeView',
], function($, toastr, commonFunc, commonVars, data, tpl, func) {
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 2000;

  $.seeView({
    events: {
      // 点击过滤
      '!click #action-filter': 'onClickActionFilter',
      // 点击重置
      '!click #action-reset': 'onClickActionReset',
      // 点击切换订单类型
      '!click [data-tab-type]': 'onClickTabType',
      // 点击全选
      '!click #select-all': 'onClickSelectAll',
      // 点击选中当前行
      'click [data-row-select]': 'onClickRowSelect',
      // 点击群发代码
      '!click #action-send': 'onClickActionSend',
      // 点击发送当前行
      'click [data-row-send]': 'onClickRowSend',
      // 点击充值
      '!click #go-to-charge': 'onClickGoToChange',
      // 点击关闭弹窗
      'click [data-popup-close]': 'onClickPopupClose',
      // 点击分页
      'click [data-page-index]': 'onClickPageIndex',
      // 点击发送
      '!click #send-popup-submit': 'onClickSendPopupSubmit',
      // 发送弹出输入计数
      '!keyup #send-popup-input': 'onKeyupSendPopupInput',
    },
    // 点击过滤
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
    // 点击重置
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
    // 点击切换订单类型
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
    // 点击全选
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
    // 点击选中当前行
    onClickRowSelect: function(e) {
      var $this = $(e.currentTarget);

      $this.toggleClass('active');

      this.checkSelectAllStatus();
    },
    // 检查全选按钮是否应该选中
    checkSelectAllStatus: function() {
      var allSelected =
          $('[data-row-select]').length == $('[data-row-select].active').length,
        $selectAll = $('#select-all');

      if (allSelected) $selectAll.addClass('active');
      else $selectAll.removeClass('active');
    },
    // 点击群发代码
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
        { type: data.currentTabType, ids: ids },
        function(res) {
          if (res.success) {
            func.showSendPopup(res, function(content) {
              $.seeAjax.post(
                'send',
                { type: data.currentTabType, ids: ids, content: content },
                function(res) {
                  if (res.success) {
                    // 更新页面显示的总条数
                    var $remainCount = $('#remain-message-count');
                    $remainCount.text(
                      parseInt($remainCount.text()) - ids.length
                    );

                    // 更新行的显示发送条数
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
    // 点击发送当前行
    onClickRowSend: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-row-send')),
        ids = [id];
      $.seeAjax.post(
        'getSendInfo',
        { type: data.currentTabType, ids: ids },
        function(res) {
          if (res.success) {
            func.showSendPopup(res, function(content) {
              $.seeAjax.post(
                'send',
                { type: data.currentTabType, ids: ids, content: content },
                function(res) {
                  if (res.success) {
                    // 更新页面显示的总条数
                    var $remainCount = $('#remain-message-count');
                    $remainCount.text(parseInt($remainCount.text()) - 1);

                    // 更新行的显示发送条数
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
    // 点击充值
    onClickGoToChange: function(e) {
      $('#charge-popup').show();
    },
    // 点击关闭弹窗
    onClickPopupClose: function(e) {
      $(e.target)
        .parents('.modal')
        .hide();
    },
    // 点击分页
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
    // 点击发送
    onClickSendPopupSubmit: function(e) {
      var inputValue = $('#send-popup-input').val();

      data.sendPopupSubmitCallback && data.sendPopupSubmitCallback(inputValue);
      $('#send-popup').hide();
    },
    // 发送弹出输入计数
    onKeyupSendPopupInput: function() {
      $('#send-popup-input-count').text($('#send-popup-input').val().length);
    },
  });
});
