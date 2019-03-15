/**
 * Created by kang on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  'common/variables',
  'old/toast',
  './data',
  './tpl',
  './function',
  '@zzh/choose-image',
  '@zzh/jquery-qrcode',
  'jquery-confirm',
  './ajax',
  'lib/jquery.seeView',
], function($, commonFunc, commonVars, Toast, data, tpl, func, ChooseImage) {
  $.seeView({
    events: {
      // 切换佛事
      'changed.bs.select #buddhistSelect': 'onChangedBuddhistSelect',
      // 点击查询
      'click #query': 'onClickQuery',
      // 点击重置
      'click #reset': 'onClickReset',
      // 点击导出Excel
      'click #export-excel': 'exportExcel',
      // 切换已处理未处理
      'click .finish-tab': 'changeOrderType',
      // 点击表格的全选
      'click .select-all-order': 'selectAllOrder',
      // 点击表格的单选
      'click .select-single-order': 'selectSingleOrder',
      // 点击设为已处理或未处理
      'click #dispose': 'onClickDispose',
      // 显示设为已处理或未处理Modal
      'show.bs.modal #dispose-order-modal': 'showDisposeOrderModal',
      // 点击设置为已处理或未处理Modal的添加反馈图片按钮
      'click #dispose-order-modal .add-feed-back-pic': 'initUpload',
      // 设为已处理或未处理Modal点击删除反馈图片
      'click #dispose-order-modal .image-cell-delete': 'deleteFeedBackImg',
      // 设为已处理或未处理Modal的确认操作
      'click #dispose-order-modal-submit': 'disposeOrder',
      // 订单详情Modal显示时
      'show.bs.modal #order-detail-modal': 'showOrderDetail',
      // 订单详情Modal的添加反馈图片按钮
      'click #order-detail-modal .add-feed-back-pic': 'initUploadAndUpdateImg',
      // 订单详情Modal点击删除反馈图片
      'click #order-detail-modal .image-cell-delete':
        'deleteFeedBackImgAndUpdate',
      // 订单详情Modal点击放大反馈图片
      'click #order-detail-modal .image-cell img': 'scaleFeedBackImg',
      // 订单详情Modal点击保存新备注
      'click #detail-modal-save-remark': 'saveRemark',
      // 订单详情Modal设为已处理或未处理按钮
      'click #detail-modal-dispose-order': 'disposeSingleOrder',
      // 点击打印设置
      'click #set-printer': 'showSetPrinterModal',
      // 点击打印机列表项input
      'click .printer-checkbox': 'selectPrinter',
      // 点击设置打印机联数
      'changed.bs.select #print-number-select': 'changePrinterContinuous',
      // 点击设置打印机二维码
      'click #set-printer-modal .print-qr-method': 'changePrinterQrCode',
      // 点击设置打印机电话打印
      'click .print-tel-method': 'changePrinterMobile',
      // 点击打印设置Modal的保存按钮
      'click #update-printer': 'updatePrinter',
      // 点击立即打印
      'click #print-order': 'showSpecialPrinterSetModal',
      // 立即打印的打印设置Modal点击设置打印机联数
      'changed.bs.select #special-print-number-select':
        'changeSpecialPrinterContinuous',
      // 立即打印的打印设置Modal点击设置打印机二维码
      'click #special-set-printer-modal .print-qr-method':
        'changeSpecialPrinterQrCode',
      // 立即打印弹出的打印机设置Modal点击打印
      'click #print': 'printOrder',
    },
    // 切换佛事
    onChangedBuddhistSelect: function(e) {
      $('#query').click();
    },
    // 点击查询
    onClickQuery: function(e) {
      // 获取参数
      var phone = parseInt($('#tel').val());
      if (isNaN(phone)) {
        phone = '';
      }
      console.log($('#buddhistSelect').val());
      // 配置数据
      data.getOrderListParams.type = parseInt(
        $('.finish-tabs li.active a').attr('data-order-type')
      );
      data.getOrderListParams.buddhistId = parseInt(
        $('#buddhistSelect').val(),
        10
      );
      data.getOrderListParams.startTime = $('#beginDate').val();
      data.getOrderListParams.endTime = $('#endDate').val();
      data.getOrderListParams.mobile = phone;
      data.getOrderListParams.pageNumber = 0;
      func.getOrderList(data.getOrderListParams, function(res) {
        func.renderOrderList(res);
      });
    },
    // 点击重置
    onClickReset: function(e) {
      $('#beginDate').val('');
      $('#endDate').val(0);
      $('#tel').val('');
      // 重新请求渲染
      func.getOrderList(
        { pageNumber: 0, type: data.getOrderListParams.type },
        function(res) {
          func.renderOrderList(res);
        }
      );
    },
    // 点击导出Excel
    exportExcel: function(e) {
      var type = data.getOrderListParams.type,
        buddhistId = parseInt($('#buddhistSelect').val()) || 0,
        mobile = parseInt($('#tel').val()),
        startTime = $('#beginDate').val(),
        endTime = $('#endDate').val();
      if (isNaN(mobile)) {
        mobile = '';
      }
      window.open(
        '/zzhadmin/getConversionOrderExcel/?type=' +
          type +
          '&startTime=' +
          startTime +
          '&endTime=' +
          endTime +
          '&mobile=' +
          mobile +
          '&commodityId=' +
          buddhistId
      );
    },
    // 切换已处理未处理
    changeOrderType: function(e) {
      var $tar = $(e.target),
        type = parseInt($('.finish-tabs li.active a').attr('data-order-type'));
      if (data.getOrderListParams.type !== type) {
        // 获取数据
        var mobile = parseInt($('#tel').val());
        if (isNaN(mobile)) {
          mobile = '';
        }
        // 配置数据
        data.getOrderListParams.type = type;
        data.getOrderListParams.startTime = $('#beginDate').val();
        data.getOrderListParams.endTime = $('#endDate').val();
        data.getOrderListParams.mobile = mobile;
        data.getOrderListParams.pageNumber = 0;
        // 重绘表格
        func.getOrderList(data.getOrderListParams, function(res) {
          func.renderOrderList(res);
        });
        // 初始化tabs下的一些样式
        $('.select-all-order').prop('checked', false);
        $('#select-num').html('0');
        if (type === 1) {
          $('#dispose').html('设为已处理');
          $('#dispose-order-modal')
            .find('.modal-title')
            .html('设为已处理');
          $('#detail-modal-dispose-order').html('设为已处理');
        } else {
          $('#dispose').html('设为未处理');
          $('#dispose-order-modal')
            .find('.modal-title')
            .html('设为未处理');
          $('#detail-modal-dispose-order').html('设为未处理');
        }
        // 初始化数据
        data.finishOrderParams.orderIds = [];
      }
    },
    // 点击表格的全选
    selectAllOrder: function(e) {
      var $tar = $(e.target),
        isChecked = $tar.prop('checked'), // 获取的是点击后的状态
        $singleSelect = $('.select-single-order');
      if (isChecked) {
        $singleSelect.each(function(index, ele) {
          if (!$(ele).prop('checked')) {
            $(ele).prop('checked', true);
            data.finishOrderParams.orderIds.push(
              parseInt($(ele).attr('data-id'))
            );
          }
        });
      } else {
        $singleSelect.each(function(index, ele) {
          if ($(ele).prop('checked')) {
            $(ele).prop('checked', false);
          }
        });
        data.finishOrderParams.orderIds = [];
      }
      // console.log(data.finishOrderParams.orderIds)
      $('#select-num').html(data.finishOrderParams.orderIds.length);
    },
    // 点击表格的单选
    selectSingleOrder: function(e) {
      var $tar = $(e.target),
        id = parseInt($tar.attr('data-id')),
        isChecked = $tar.prop('checked'); // 获取的是点击后的状态
      if (isChecked) {
        data.finishOrderParams.orderIds.push(id);
      } else {
        data.finishOrderParams.orderIds.splice(
          data.finishOrderParams.orderIds.indexOf(id),
          1
        );
      }
      // console.log(data.finishOrderParams.orderIds)
      $('#select-num').html(data.finishOrderParams.orderIds.length);
    },
    // 点击设为已处理或未处理
    onClickDispose: function(e) {
      if (data.finishOrderParams.orderIds.length) {
        $('#dispose-order-modal').modal('show');
      } else {
        Toast('请勾选需要设置的订单', 2, 2000, false);
      }
    },
    // 设为已处理或未处理Modal显示时
    showDisposeOrderModal: function(e) {
      // 初始化样式
      $('#dispose-order-modal')
        .find('.image-container')
        .html('');
    },
    // 点击设置为已处理或未处理Modal的添加反馈图片按钮
    initUpload: function(e) {
      var $tar = $(e.target),
        dataModal = $tar.attr('data-modal'),
        $modalContainer = $(dataModal);
      // 初始化upload
      var upload = new ChooseImage({
        multiSelect: !0,
        onSubmit: function(data) {
          func.renderFeedBackImg($modalContainer, data);
        },
      });
      upload.show();
    },
    // 设为已处理或未处理Modal点击删除反馈图片
    deleteFeedBackImg: function(e) {
      var $tar = $(e.target);
      $($tar.parent()).remove();
    },
    // 订单详情Modal点击放大反馈图片
    scaleFeedBackImg: function(e) {
      var $tar = $(e.target),
        $modal = $('#show-feed-back-pic'),
        src = $tar.prop('src');
      $modal.find('img').prop('src', src);
      $modal.modal('show');
    },
    // 订单详情Modal点击删除反馈图片
    deleteFeedBackImgAndUpdate: function(e) {
      var $tar = $(e.target),
        $modal = $('#order-detail-modal'),
        id = parseInt($modal.attr('data-id')),
        orderIds = [],
        pics = '';
      $($tar.parent()).remove();
      orderIds.push(id);
      $modal.find('.image-container .image-cell').each(function(index, ele) {
        pics += $(ele).attr('data-src') + ',';
      });
      pics = pics.substring(0, pics.length - 1); // 去除尾逗号
      func.saveFeedBackImgOrRemark({ orderIds: orderIds, pics: pics }, function(
        res
      ) {
        Toast('删除成功', 1, 1000, false);
      });
      // 修改本地存储的数据,供订单详情Modal显示时渲染，订单详情的orderIds只有一个元素
      data.orderListRes.data.map(function(value) {
        if (value.id === orderIds[0]) {
          value.dispose_pic_url = pics;
        }
      });
    },
    // 订单详情点击添加反馈图片
    initUploadAndUpdateImg: function(e) {
      var $tar = $(e.target),
        dataModal = $tar.attr('data-modal'),
        $modalContainer = $(dataModal);
      // 初始化upload
      var upload = new ChooseImage({
        // 订单详情Modal
        multiSelect: !0,
        onSubmit: function(imgData) {
          func.renderFeedBackImg($modalContainer, imgData);
          var $modal = $('#order-detail-modal'),
            id = parseInt($modal.attr('data-id')),
            orderIds = [],
            pics = '';
          orderIds.push(id);
          $modal
            .find('.image-container .image-cell')
            .each(function(index, ele) {
              pics += $(ele).attr('data-src') + ',';
            });
          pics = pics.substring(0, pics.length - 1); // 去除尾逗号
          func.saveFeedBackImgOrRemark(
            { orderIds: orderIds, pics: pics },
            function(res) {
              Toast('更新成功', 1, 1000, false);
            }
          );
          data.orderListRes.data.map(function(value) {
            if (value.id === orderIds[0]) {
              value.dispose_pic_url = pics;
            }
          });
        },
      });
      upload.show();
    },
    // 订单详情Modal点击保存新备注
    saveRemark: function(e) {
      var $modal = $('#order-detail-modal'),
        id = parseInt($modal.attr('data-id')),
        orderIds = [],
        remark = $('#order-detail-remark').val();
      orderIds.push(id);
      func.saveFeedBackImgOrRemark(
        { orderIds: orderIds, remark: remark },
        function(res) {
          Toast('更新成功', 1, 1000, false);
          $modal.modal('hide');
        }
      );
      data.orderListRes.data.map(function(value) {
        if (value.id === orderIds[0]) {
          value.remark = remark;
        }
      });
    },
    // 设为已处理或未处理Modal的确认操作
    disposeOrder: function(e) {
      var pics = '';
      $('#dispose-order-modal')
        .find('.image-container .image-cell')
        .each(function(index, ele) {
          pics += $(ele).attr('data-src') + ',';
        });
      pics = pics.substring(0, pics.length - 1); // 去除尾逗号
      data.finishOrderParams.remark = $('#dispose-order-modal-remark').val();
      data.finishOrderParams.pics = pics;
      func.disposeOrder(data.finishOrderParams, function(res) {
        // 重新渲染显示未处理订单
        // 跳转至类型对应订单
        if (data.getOrderListParams.type === 1) {
          $('#finish-tab').click();
        } else {
          $('#un-finish-tab').click();
        }
      });
    },
    // 订单详情Modal显示时
    showOrderDetail: function(e) {
      var $relatedTar = $(e.relatedTarget),
        id = parseInt($relatedTar.attr('data-id'));
      data.orderListRes.data.map(function(value) {
        if (value.id === id) {
          func.renderOrderDetailModal(value);
        }
      });
      $('#order-detail-modal').attr('data-id', id);
    },
    // 订单详情Modal设为已处理或未处理按钮
    disposeSingleOrder: function(e) {
      var $modal = $('#order-detail-modal'),
        id = parseInt($modal.attr('data-id')),
        orderIds = [],
        pics = '',
        remark = $('#order-detail-remark').val();
      orderIds.push(id);
      $modal.find('.image-container .image-cell').each(function(index, ele) {
        pics += $(ele).attr('data-src') + ',';
      });
      pics = pics.substring(0, pics.length - 1); // 去除尾逗号
      func.disposeOrder(
        { orderIds: orderIds, pics: pics, remark: remark },
        function(res) {
          $modal.modal('hide');
          // 跳转至类型对应订单
          if (data.getOrderListParams.type === 1) {
            $('#finish-tab').click();
          } else {
            $('#un-finish-tab').click();
          }
        }
      );
    },
    // 点击打印设置
    showSetPrinterModal: function(e) {
      // 样式初始化
      func.getPrinterList({}, function(res) {
        if (res.data.length) {
          func.renderPrinterList(res);
          func.getPrinter({}, function(res) {
            func.renderPrinter(res);
          });
          $('#set-printer-modal').modal('show');
        } else {
          $('#no-printer-modal').modal('show');
        }
      });
    },
    // 点击打印机列表项input
    selectPrinter: function(e) {
      var $tar = $(e.target),
        id = parseInt($tar.attr('data-id'));
      if ($tar.prop('checked')) {
        func.getPrinterStatus({ printerId: id }, function(res) {
          $tar
            .parent()
            .find('.exception-tip')
            .html(res.msg);
        });
      } else {
        $tar
          .parent()
          .find('.exception-tip')
          .html('');
      }
    },
    // 点击设置打印机联数
    changePrinterContinuous: function(e) {
      var $select = $('#print-number-select');
      if (parseInt($select.val()) === 1 && $('#print-divide').prop('checked')) {
        Toast(
          '请先把“打印联数”设置为大于1，再设置隔联打印功能。',
          2,
          2000,
          false
        );
        $select.val(2).selectpicker('refresh');
      }
    },
    // 点击设置打印机二维码
    changePrinterQrCode: function(e) {
      var $select = $('#print-number-select');
      if (parseInt($select.val()) === 1 && $('#print-divide').prop('checked')) {
        Toast(
          '请先把“打印联数”设置为大于1，再设置隔联打印功能。',
          2,
          2000,
          false
        );
        // $select.val(2).selectpicker('refresh');
        $('#print-all').prop('checked', true);
      }
    },
    // 点击设置打印机电话打印
    changePrinterMobile: function(e) {},
    // 点击打印设置Modal的保存按钮
    updatePrinter: function(e) {
      // 初始化参数
      data.updatePrinterParams.printerIdList = [];
      // 获取参数
      var continuousPrintNum = parseInt($('#print-number-select').val()), // 打印联数
        qrcodePrint,
        isPrintMobile;
      // 二维码
      $('[name="print-qr-method"]').each(function(index, ele) {
        if ($(ele).prop('checked')) {
          qrcodePrint = parseInt($(ele).attr('data-value'));
        }
      });
      // 电话号码
      $('[name="print-tel-method"]').each(function(index, ele) {
        if ($(ele).prop('checked')) {
          isPrintMobile = parseInt($(ele).attr('data-value'));
        }
      });
      // 打印机id
      $('#set-printer-modal')
        .find('.printer-checkbox')
        .each(function(index, ele) {
          if ($(ele).prop('checked')) {
            var newObj = {};
            newObj.id = parseInt($(ele).attr('data-id'));
            newObj.continuousPrintNum = continuousPrintNum;
            newObj.qrcodePrint = qrcodePrint;
            newObj.isPrintMobile = isPrintMobile;
            data.updatePrinterParams.printerIdList.push(newObj);
          }
        });
      // console.log(data.updatePrinterParams);
      if (data.updatePrinterParams.printerIdList.length) {
        // 至少选中一台打印机
        func.updatePrinter(data.updatePrinterParams, function() {
          $('#set-printer-modal').modal('hide');
        });
      } else {
        Toast('至少勾选一台打印机', 2, 2000, false);
      }
    },
    // 点击立即打印
    showSpecialPrinterSetModal: function(e) {
      func.getPrinterList({}, function(res) {
        if (res.data.length) {
          // 购买了打印机
          data.printOrderParams.orderIdList = data.finishOrderParams.orderIds;
          if (data.printOrderParams.orderIdList.length) {
            func.renderPrinterList(res);
            // 样式初始化
            $('#special-print-number-select')
              .val(1)
              .selectpicker('refresh');
            $('#special-print-all').prop('checked', true);
            $('#special-print-tel').prop('checked', true);
            $('#special-set-printer-modal').modal('show');
          } else {
            Toast('请勾选需要打印的订单', 2, 2000, false);
          }
        } else {
          // 未购买打印机
          $('#no-printer-modal').modal('show');
        }
      });
    },
    // 立即打印的打印设置Modal点击设置打印机联数
    changeSpecialPrinterContinuous: function(e) {
      var $select = $('#special-print-number-select');
      if (
        parseInt($select.val()) === 1 &&
        $('#special-print-divide').prop('checked')
      ) {
        Toast(
          '请先把“打印联数”设置为大于1，再设置隔联打印功能。',
          2,
          2000,
          false
        );
        $select.val(2).selectpicker('refresh');
      }
    },
    // 立即打印的打印设置Modal点击设置打印机二维码
    changeSpecialPrinterQrCode: function(e) {
      var $select = $('#special-print-number-select');
      if (
        parseInt($select.val()) === 1 &&
        $('#special-print-divide').prop('checked')
      ) {
        Toast(
          '请先把“打印联数”设置为大于1，再设置隔联打印功能。',
          2,
          2000,
          false
        );
        // $select.val(2).selectpicker('refresh');
        $('#special-print-all').prop('checked', true);
      }
    },
    // 立即打印弹出的打印机设置Modal点击打印
    printOrder: function(e) {
      // 获取参数
      var printerIdList = [],
        printNum,
        qrcodePrint,
        isPrintMobile;
      // 打印联数
      printNum = parseInt($('#special-print-number-select').val());
      // 二维码
      $('[name="special-print-qr-method"]').each(function(index, ele) {
        if ($(ele).prop('checked')) {
          qrcodePrint = parseInt($(ele).attr('data-value'));
        }
      });
      // 电话号码
      $('[name="special-print-tel-method"]').each(function(index, ele) {
        if ($(ele).prop('checked')) {
          isPrintMobile = parseInt($(ele).attr('data-value'));
        }
      });
      // 打印机id
      $('#special-set-printer-modal')
        .find('.printer-checkbox')
        .each(function(index, ele) {
          if ($(ele).prop('checked')) {
            var id = parseInt($(ele).attr('data-id'));
            printerIdList.push(id);
          }
        });
      data.printOrderParams.printerIdList = printerIdList;
      data.printOrderParams.printNum = printNum;
      data.printOrderParams.qrcodePrint = qrcodePrint;
      data.printOrderParams.isPrintMobile = isPrintMobile;
      if (data.printOrderParams.printerIdList.length) {
        func.printOrder(data.printOrderParams, function(res) {
          Toast('正在打印，请稍候。', 1, 2000, false);
          $('#special-set-printer-modal').modal('hide');
        });
      } else {
        Toast('请至少勾选一台打印机', 2, 2000, false);
      }
    },
  });
});
