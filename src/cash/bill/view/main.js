/**
 * Created by senntyou on 2017/3/29.
 */
define([
  'jquery',
  'toastr',
  'common/variables',
  'common/function',
  '../data',
  '../func',
  '../tpl',
  '../util/show_prize_dialog',
  'lib/jquery.seeView',
], function($, toastr, commonVars, fn, data, func, tpl, showPrizeDialog) {
  var $body = $('body'),
    $questionDialog = $('#dialog-question'),
    $confirmDialog = $('#dialog-confirm'),
    $cancelDialog = $('#dialog-cancel'),
    $handlingDialog = $('#dialog-handling'),
    $receiptTipDialog = $('#dialog-receipt-tip'),
    $forbidDialog = $('#dialog-forbid');

  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 1000;
  toastr.options.onHidden = function() {
    location.href = '/zzhadmin/cashTake/';
  };

  $.seeView({
    events: {
      // 点击切换状态
      'click [data-status-menu]': 'onClickStatusMenu',
      // 选择某一年
      'click [data-select-year]': 'onClickSelectYear',
      // 点击选择账单
      'click [data-select-bill]': 'onClickSelectBill',
      // 点击选择所有的账单
      'click [data-select-all-bills]': 'onClickSelectAllBills',
      // 点击状态操作
      'click [data-status-action]': 'onClickStatusAction',
      // 点击弹出框
      'click [data-popup-close]': 'onClickPopup',
      'click [data-popup-overlay]': 'onClickPopup',
      // 点击确定弹出框
      'click [data-popup-submit]': 'onClickPopupSubmit',
    },
    // 点击切换状态
    onClickStatusMenu: function(e) {
      var self = this,
        $this = $(e.target),
        status = parseInt($this.attr('data-status-menu'));

      // 菜单
      $('[data-status-menu]').removeClass('active');
      $('[data-status-menu="' + status + '"]').addClass('active');

      // 右边选择年份
      $('[data-select-year-container]').hide();
      $('[data-select-year-container="' + status + '"]').show();

      // 内容
      $('[data-status-container]').hide();
      $('[data-status-container="' + status + '"]').show();

      // 底部操作
      $('[data-status-actions-container]').hide();
      $('[data-status-actions-container="' + status + '"]').show();

      // 请求初始化第一次的数据
      !data.statusRequested[status] &&
        ((data.statusRequested[status] = !0),
        func.requestBillData(commonVars.today.year, status));
    },
    // 选择某一年
    onClickSelectYear: function(e) {
      var $this = $(e.target),
        year = parseInt($this.attr('data-select-year')),
        status = parseInt($this.attr('data-status')),
        currentYear = parseInt(
          $('[data-selected-year][data-status="' + status + '"]').attr(
            'data-selected-year'
          )
        ),
        $yearContainers = $(
          '[data-year-content][data-status="' + status + '"]'
        ),
        $targetYearContainer = $(
          '[data-year-content="' + year + '"][data-status="' + status + '"]'
        );

      if (year == currentYear) return;

      $.seeBind.setData('data-selected-year', year, { status: status });

      $yearContainers.hide();

      // 未请求过
      if (!$targetYearContainer.length) {
        // 创建今天的数据容器
        $targetYearContainer = $(
          tpl.yearContentContainer.render({
            year: year,
            status: status,
          })
        );

        $('[data-status-container="' + status + '"]').append(
          $targetYearContainer
        );
        func.requestBillData(year, status);
      }

      $targetYearContainer.show();
    },
    // 点击选择账单
    onClickSelectBill: function(e) {
      var $this = $(e.currentTarget);

      $this.toggleClass('active');

      var year = parseInt($this.attr('data-select-bill')),
        status = parseInt($this.attr('data-status')),
        $selectedItems = $(
          '[data-select-bill="' +
            year +
            '"][data-status="' +
            status +
            '"].active'
        ),
        $actions = $('[data-status-action]');

      var $totalCount = $(
          '[data-show-total-count="' + year + '"][data-status="' + status + '"]'
        ),
        $totalMoney = $(
          '[data-show-total-money="' + year + '"][data-status="' + status + '"]'
        ),
        $realTotalMoney = $(
          '[data-show-real-total-money="' +
            year +
            '"][data-status="' +
            status +
            '"]'
        ),
        $totalFee = $(
          '[data-show-total-fee="' + year + '"][data-status="' + status + '"]'
        ),
        $totalCharge = $(
          '[data-show-total-charge="' +
            year +
            '"][data-status="' +
            status +
            '"]'
        ),
        $totalAssistance = $(
          '[data-show-total-assistance="' +
            year +
            '"][data-status="' +
            status +
            '"]'
        ),
        totalCount = 0,
        totalMoney = 0,
        totalFee = 0,
        totalCharge = 0,
        totalAssistance = 0;

      $(
        '[data-select-all-bills="' + year + '"][data-status="' + status + '"]'
      ).removeClass('active');

      if (!$selectedItems.length) {
        $actions.addClass('btn-gray').attr({
          'data-disabled': 1,
        });
      } else {
        $actions.removeClass('btn-gray').attr({
          'data-disabled': 0,
        });
        $selectedItems.map(function() {
          var $this = $(this);
          totalCount += parseFloat($this.attr('data-count')) || 0;
          totalMoney += parseFloat($this.attr('data-money')) || 0;
          totalFee += parseFloat($this.attr('data-fee')) || 0;
          totalCharge += parseFloat($this.attr('data-charge')) || 0;
          totalAssistance += parseFloat($this.attr('data-assistance')) || 0;
        });
      }
      $totalCount.text(totalCount);
      $totalMoney.text(totalMoney.toFixed(2));
      $realTotalMoney.text(
        (totalMoney + totalAssistance - totalCharge - totalFee).toFixed(2)
      );
      $totalFee.text(totalFee.toFixed(2));
      $totalCharge.text(totalCharge.toFixed(2));
      $totalAssistance.text(totalAssistance.toFixed(2));
    },
    // 点击选择所有的账单
    onClickSelectAllBills: function(e) {
      var $this = $(e.currentTarget),
        year = parseInt($this.attr('data-select-all-bills')),
        status = parseInt($this.attr('data-status')),
        $items = $(
          '[data-select-bill="' + year + '"][data-status="' + status + '"]'
        ),
        $actions = $('[data-status-action]');

      var $totalCount = $(
          '[data-show-total-count="' + year + '"][data-status="' + status + '"]'
        ),
        $totalMoney = $(
          '[data-show-total-money="' + year + '"][data-status="' + status + '"]'
        ),
        $realTotalMoney = $(
          '[data-show-real-total-money="' +
            year +
            '"][data-status="' +
            status +
            '"]'
        ),
        $totalFee = $(
          '[data-show-total-fee="' + year + '"][data-status="' + status + '"]'
        ),
        $totalCharge = $(
          '[data-show-total-charge="' +
            year +
            '"][data-status="' +
            status +
            '"]'
        ),
        $totalAssistance = $(
          '[data-show-total-assistance="' +
            year +
            '"][data-status="' +
            status +
            '"]'
        ),
        totalCount = 0,
        totalMoney = 0,
        totalFee = 0,
        totalCharge = 0,
        totalAssistance = 0;

      if ($this.hasClass('active')) {
        $items.removeClass('active');
        $this.removeClass('active');
        $actions.addClass('btn-gray').attr({
          'data-disabled': 1,
        });
      } else {
        $items.addClass('active');
        $this.addClass('active');
        $actions.removeClass('btn-gray').attr({
          'data-disabled': 0,
        });
        totalCount = parseFloat($this.attr('data-total-count'));
        totalMoney = parseFloat($this.attr('data-total-money'));
        totalFee = parseFloat($this.attr('data-total-fee'));
        totalCharge = parseFloat($this.attr('data-total-charge'));
        totalAssistance = parseFloat($this.attr('data-total-assistance'));
      }
      $totalCount.text(totalCount);
      $totalMoney.text(totalMoney.toFixed(2));
      $realTotalMoney.text(
        (totalMoney + totalAssistance - totalCharge - totalFee).toFixed(2)
      );
      $totalFee.text(totalFee.toFixed(2));
      $totalCharge.text(totalCharge.toFixed(2));
      $totalAssistance.text(totalAssistance.toFixed(2));
    },
    // 点击状态操作
    onClickStatusAction: function(e) {
      var self = this,
        $this = $(e.target),
        disabled =
          $this.attr('data-disabled') &&
          !!parseInt($this.attr('data-disabled')),
        action = parseInt($this.attr('data-status-action')),
        status = parseInt($this.attr('data-status')),
        year = parseInt(
          $('[data-selected-year][data-status="' + status + '"]').attr(
            'data-selected-year'
          )
        ),
        $selectedItems = $(
          '[data-select-bill="' +
            year +
            '"][data-status="' +
            status +
            '"].active'
        ),
        billIds = [],
        urls = ['questionBills', 'confirmBills', 'cancelBills'],
        url = urls[status - 1];

      if (disabled) return;
      if (!$selectedItems.length) {
        fn.dialog('您尚未选择项目，请至少选择一项。');
        return;
      }

      $selectedItems.map(function() {
        billIds.push(parseInt($(this).attr('data-bill-id')));
      });

      // 保存到公共变量
      data.saveBillIds = billIds;

      // 疑问订单
      if (action == 1) $questionDialog.show();
      // 确认订单
      else if (action == 2) {
        // 有订单正在处理
        if (data.haveOrderInHandling) $handlingDialog.show();
        // 超过最大未寄收据数
        else if (!data.canTakeOrder) $forbidDialog.show();
        // 有未寄收据数，但没达到上限
        else if (data.currentWaitingReceipts) $receiptTipDialog.show();
        // 正常提现
        else showPrizeDialog();
      }
      // 撤销订单
      else if (action == 3) $cancelDialog.show();
    },
    // 点击弹出框
    onClickPopup: function(e) {
      var $this = $(e.target),
        $popup = $this.parents('.dialog'),
        canClose =
          !!$this.attr('data-popup-close') ||
          !!$this.attr('data-popup-overlay');

      if (canClose) {
        $popup.hide();
        $popup.find('[data-popup-input]').val('');
        $popup.attr('data-scroll-window') && $body.removeClass('of-hidden');
      }
    },
    // 点击确定弹出框
    onClickPopupSubmit: function(e) {
      var self = this,
        $this = $(e.target),
        action = parseInt($this.attr('data-popup-submit')),
        handlingStr = $this.attr('data-handling'),
        handling = handlingStr && parseInt(handlingStr),
        inputText = $('[data-popup-input="' + action + '"]').val();

      if (handling) return;

      if (action == 1 && !inputText) {
        fn.dialog('请填写您有疑问的原因');
        return;
      }

      if (action == 1) self.onSubmitQuestion($this, inputText);
      else if (action == 2) self.onSubmitConfirm($this);
      else if (action == 3) self.onSubmitCancel($this);
      else if (action == 5) self.onSubmitReceiptTip();
    },
    // 处理疑问
    onSubmitQuestion: function($this, inputText) {
      $this.attr({ 'data-handling': 1 }).text('正在处理...');
      $.seeAjax.get(
        'questionBills',
        { ids: JSON.stringify(data.saveBillIds), extra: inputText },
        function(res) {
          res.success &&
            ($this.attr({ 'data-handling': 0 }).text('提交'),
            $questionDialog.hide(),
            $('[data-popup-input="1"]').val(''),
            func.resetStatusData(2),
            //setTimeout(function () {fn.dialog('提交疑问账单成功')}, 200)
            toastr.success('提交疑问账单成功'));
        }
      );
    },
    // 处理确定
    onSubmitConfirm: function($this) {
      $this.attr({ 'data-handling': 1 }).text('正在处理...');
      $.seeAjax.get(
        'confirmBills',
        {
          ids: JSON.stringify(data.saveBillIds),
          extra: '',
          reward: data.currentDonateMoney,
        },
        function(res) {
          res.success &&
            ($this.attr({ 'data-handling': 0 }).text('确认提交'),
            $confirmDialog.hide(),
            data.saveBillIds.map(function(id) {
              $('[data-unit="' + id + '"][data-status="1"]').remove();
            }),
            toastr.success('提交账单成功'));
        }
      );
    },
    // 撤销疑问
    onSubmitCancel: function($this) {
      $this.attr({ 'data-handling': 1 }).text('正在处理...');
      $.seeAjax.get(
        'cancelBills',
        { ids: JSON.stringify(data.saveBillIds) },
        function(res) {
          res.success &&
            ($this.attr({ 'data-handling': 0 }).text('提交'),
            $cancelDialog.hide(),
            $('[data-popup-input="3"]').val(''),
            data.saveBillIds.map(function(id) {
              $('[data-unit="' + id + '"][data-status="2"]').remove();
            }),
            func.resetStatusData(1),
            //setTimeout(function () {fn.dialog('撤回疑问账单成功')}, 200)
            toastr.success('撤回疑问账单成功'));
        }
      );
    },
    // 继续提现
    onSubmitReceiptTip: function() {
      $receiptTipDialog.hide();
      showPrizeDialog();
    },
  });
});
