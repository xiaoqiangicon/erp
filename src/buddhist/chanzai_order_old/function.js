/**
 * Created by kang on 2017/8/3.
 */

define([
  'jquery',
  'common/function',
  './data',
  './tpl',
  '@zzh/pagination',
  './ajax',
  'bootstrap-select',
  '@zzh/jquery-qrcode',
], function($, commonFunc, data, tpl, Pagination) {
  var func = {};
  func.init = function() {
    $('#loading-toast').addClass('hide');
    //日期初始化
    $('.input-daterange').datepicker({
      keyboardNavigation: false,
      language: 'zh-CN',
      todayHighlight: true,
      forceParse: false,
      autoclose: true,
      clearBtn: false,
      format: 'yyyy-mm-dd',
    });
    $('.input-daterange input').each(function() {
      $(this).datepicker('clearDates');
    });

    func.getBuddhistList({}, function(res) {
      func.renderBuddhistSelect(res);
    });

    func.getOrderList({ pageNumber: 0 }, function(res) {
      func.renderOrderList(res);
    });
  };
  // 通用逻辑 数据请求 -> 回调执行 数据处理 渲染 ...

  // 请求佛事列表
  func.getBuddhistList = function(params, callback) {
    $.seeAjax.get('buddhistList', params, function(res) {
      if (res.success) {
        callback && callback(res);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    });
  };

  // 渲染佛事下拉
  func.renderBuddhistSelect = function(res) {
    var $select = $('#buddhistSelect');
    var htmlStr = '';

    res.data.map(function(item) {
      htmlStr += tpl.selectOption.render(item);
    });

    $select.append(htmlStr);
    $select.selectpicker({
      noneSelectedText: '请选择',
      noneResultsText: '未匹配到 {0}',
    });
    $select.selectpicker('refresh');
  };

  // 请求订单列表
  func.getOrderList = function(params, callback) {
    typeof params.pageNumber === 'undefined' && (params.pageNumber = 1);
    typeof params.pageSize === 'undefined' && (params.pageSize = 25);
    typeof params.type === 'undefined' && (params.type = 1); // 订单已处理未处理状态 1未处理2已处理
    typeof params.buddhistId === 'undefined' && (params.budhdistId = 0); // 佛事id
    typeof params.mobile === 'undefined' && (params.mobile = ''); // 佛事状态
    typeof params.startTime === 'undefined' && (params.startTime = ''); // 查询文本
    typeof params.endTime === 'undefined' && (params.endTime = ''); // 按照参与人数重排
    // 实时修改当前页指向
    data.currentPage = params.pageNumber;
    $.seeAjax.get('orderList', params, function(res) {
      res.success
        ? (function() {
            callback && callback(res);
          })()
        : res.message && commonFunc.alert(res.message);
    });
  };
  // 处理请求订单列表的返回数据
  func.handleOrderListRes = function(res) {
    res.data.map(function(item) {
      // 订单详情Modal中的反馈图片需要的数据
      item.dispose_pic_url && (item.images = item.dispose_pic_url.split(','));
    });
    data.orderListRes = res;
  };
  // 渲染订单列表
  func.renderOrderList = function(res) {
    if (data.getOrderListParams.type === 1) {
      // 修改左侧边栏以及未转单导航的订单数
      $('.badge[data-chanzai-order-count]').html(res.total);
      window.localStorage.setItem('chanzai_orderNumber', res.total);
    }
    var $cellContainer = $('#order-list-container'),
      htmlStr = '';
    func.handleOrderListRes(res);
    // 渲染数据
    res.data.map(function(item) {
      htmlStr += tpl.tableCell.render(item);
    });
    !htmlStr && (htmlStr = tpl.cellContainerEmpty.render({}));
    $cellContainer.html(htmlStr);
    // 渲染分页器
    if (res.total) {
      func.createPagination(res.total, data.currentPage);
    } else {
      $('#pagination-container').html('');
    }
  };
  // 调用分页器
  func.createPagination = function(totalCount, currentPage) {
    // 总数传0时会生成空的分页器容器代替之前的分页器
    var pageSize = 25,
      totalPages = Math.ceil(totalCount / pageSize),
      pagination = new Pagination($('#pagination-container'), {
        onChange: function(pageToChange) {
          // 回调中调用currentPage获取的是点击前的页数
          data.getOrderListParams.pageNumber = pageToChange - 1;
          func.getOrderList(data.getOrderListParams, function(res) {
            func.renderOrderList(res);
          });
        }, // 切换页码回调函数，页面以 1 开始索引
        showDesc: !1, // 是否显示左边（共多少条，每页多少条的信息）
        showGoTo: !1, // 是否显示右边跳转到某一页
        currentPage: currentPage + 1, // 初始化当前页
        totalPages: totalPages, // 总页数
        totalCount: totalCount, // 总条数
        perPage: pageSize, // 每页条数
      });
    pagination.render();
  };
  // 渲染反馈图片(upload回调中使用)
  func.renderFeedBackImg = function($modalContainer, data) {
    var $imageContainer = $modalContainer.find('.image-container'),
      htmlStr = '';
    data.map(function(item) {
      htmlStr += tpl.imageCell.render(item);
    });
    $modalContainer.find('.no-feed-back-container').hide();
    $imageContainer.append(htmlStr);
  };
  // 设为已处理或未处理
  func.disposeOrder = function(params, callback) {
    typeof params.orderIds === 'undefined' && (params.orderIds = []);
    typeof params.pics === 'undefined' && (params.pics = '');
    typeof params.remark === 'undefined' && (params.remark = '');
    params.orderIds = JSON.stringify(params.orderIds); // 数组序列化
    $.seeAjax.post('finishOrder', params, function(res) {
      res.success
        ? (function() {
            callback && callback(res);
          })()
        : res.message && commonFunc.alert(res.message);
    });
  };
  // 保存反馈图片或备注
  func.saveFeedBackImgOrRemark = function(params, callback) {
    typeof params.orderIds === 'undefined' && (params.orderIds = []);
    params.orderIds = JSON.stringify(params.orderIds); // 数组序列化
    $.seeAjax.post('saveFeedBackImgOrRemark', params, function(res) {
      res.success
        ? (function() {
            callback && callback(res);
          })()
        : res.message && commonFunc.alert(res.message);
    });
  };
  // 渲染订单详情Modal
  func.renderOrderDetailModal = function(data) {
    var $container = $('#order-detail-container'),
      htmlStr = '';
    htmlStr = tpl.orderDetail.render(data);
    $container.html(htmlStr);
    // 修改remark
    $('#order-detail-remark').val(data.remark);
    // 生成二维码
    var $qrcode = $('#qrcode'),
      qrcodeSrc = $qrcode.attr('data-src');
    $qrcode.qrcode({ width: 100, height: 100, text: qrcodeSrc });
  };
  // 获取打印机列表
  func.getPrinterList = function(params, callback) {
    $.seeAjax.get('getPrinterList', params, function(res) {
      res.success
        ? (function() {
            callback && callback(res);
          })()
        : res.message && commonFunc.alert(res.message);
    });
  };
  // 渲染未配置打印机列表
  func.renderPrinterList = function(res) {
    var $container = $('.no-select-printer-container'),
      htmlStr = '';
    res.data.map(function(value) {
      htmlStr += tpl.noSelectPrinterList.render(value);
    });
    $container.html(htmlStr);
  };
  // 获取打印机状态
  func.getPrinterStatus = function(params, callback) {
    $.seeAjax.post(
      'getPrinterStatus',
      params,
      function(res) {
        res.success
          ? (function() {
              callback && callback(res);
            })()
          : res.message && commonFunc.alert(res.message);
      },
      true
    );
  };
  // 获取打印设置
  func.getPrinter = function(params, callback) {
    $.seeAjax.get('getPrinter', params, function(res) {
      res.success
        ? (function() {
            data.getPrinterRes = res;
            callback && callback(res);
          })()
        : res.message && commonFunc.alert(res.message);
    });
  };
  // 根据打印配置渲染打印机Modal
  func.renderPrinter = function(res) {
    // 上传时为多个打印机共用同一套配置，因此获取时不进行遍历，选取第一项进行渲染，且不分有无规格
    var qrcodePrint = res.data[0].qrcodePrint,
      isPrintMobile = res.data[0].isPrintMobile,
      continuousPrintNum = res.data[0].continuousPrintNum;
    // 选中配置的打印机
    res.data.map(function(value) {
      $('.printer-checkbox[data-id=' + value.id + ']').prop('checked', true);
    });
    // 打印联数
    $('#print-number-select')
      .val(continuousPrintNum)
      .selectpicker('refresh');
    // 二维码
    $('[name="print-qr-method"][data-value=' + qrcodePrint + ']').prop(
      'checked',
      true
    );
    // 电话号码
    $('[name="print-tel-method"][data-value=' + isPrintMobile + ']').prop(
      'checked',
      true
    );
  };
  // 更新打印设置
  func.updatePrinter = function(params, callback) {
    typeof params.printerIdList === 'undefined' && (params.printerIdList = []);
    params.printerIdList = JSON.stringify(params.printerIdList); // 数组序列化
    $.seeAjax.post('updatePrinter', params, function(res) {
      res.success
        ? (function() {
            callback && callback(res);
          })()
        : res.message && commonFunc.alert(res.message);
    });
  };
  // 打印
  func.printOrder = function(params, callback) {
    typeof params.orderIdList === 'undefined' && (params.orderIdList = []);
    typeof params.printerIdList === 'undefined' && (params.printerIdList = []);
    params.orderIdList = JSON.stringify(params.orderIdList); // 数组序列化
    params.printerIdList = JSON.stringify(params.printerIdList);
    $.seeAjax.post('printOrder', params, function(res) {
      res.success
        ? (function() {
            callback && callback(res);
          })()
        : res.message && commonFunc.alert(res.message);
    });
  };
  return func;
});
