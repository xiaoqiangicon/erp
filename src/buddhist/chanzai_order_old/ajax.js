/**
 * Created by kang on 2017/8/3.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    // 左侧本地，右侧服务器
    buddhistList: {},
    orderList: {
      pageNumber: 'pageIndex',
      pageSize: 'pageSize',
      type: 'type', // 订单状态 1已处理2未处理
      buddhistId: 'commodityId',
      mobile: 'mobile',
      startTime: 'startTime',
      endTime: 'endTime',
    },
    orderExcel: {
      type: 'type',
      mobile: 'mobile',
      startTime: 'startTime',
      endTime: 'endTime',
    },
    finishOrder: {
      orderIds: 'orderIds',
      pics: 'pics',
      remark: 'remark',
    },
    saveFeedBackImgOrRemark: {
      orderIds: 'orderIds',
      pics: 'pics',
      remark: 'remark',
    },
    getPrinterList: {},
    getPrinterStatus: {
      printerId: 'printerId',
    },
    getPrinter: {},
    updatePrinter: {
      printerIdList: 'printerSnList',
      // [
      //     {
      //         id:'id',
      //         continuousPrintNum:'continuousPrintNum',
      //         qrcodePrint:'qrcodePrint',
      //         isPrintMobile:'isPrintMobile',
      //     }
      // ]
    },
    printOrder: {
      orderIdList: 'orderIdList',
      printerIdList: 'printerIdList',
      printNum: 'printNum',
      qrcodePrint: 'qrcodePrint',
      isPrintMobile: 'isPrintMobile',
    },
  };
  var responseRefactorOuter = {
    // 左侧本地数据名称，右侧服务器名称
    buddhistList: {
      data: [
        {
          id: 'commodityId',
          // name: 'name'
        },
      ],
    },
  };
  var preHandleOuter = {
    orderList: function(data) {},
  };
  var postHandleOuter = {
    common: function(res) {
      // success field
      res.success = res.result >= 0;
      // message field
      typeof res.msg != 'undefined' && (res.message = res.msg);
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      buddhistList: 'buddhistList', // 获取佛事列表
      orderList: 'orderList', // 获取订单列表
      orderExcel: 'orderExcel', // 打印订单Excel
      finishOrder: 'finishOrder', // 处理未完成订单
      saveFeedBackImgOrRemark: 'saveFeedBackImgOrRemark', // 保存反馈图片或备注
      getPrinterList: 'getPrinterList', // 获取打印机列表
      getPrinterStatus: 'getPrinterStatus', // 获取打印机状态
      getPrinter: 'getPrinter', // 获取打印机配置
      updatePrinter: 'updatePrinter', // 更新打印机配置
      printOrder: 'printOrder', // 打印订单
    },
    //url请求地址
    url: {
      buddhistList: [
        '/zzhadmin/getCommodityNameList/',
        '/src/buddhist/chanzai_order/mock/order_list_server.json',
        '/src/buddhist/chanzai_order/mock/order_list.json',
      ],
      orderList: [
        '/zzhadmin/getConversionOrderList/',
        '/src/buddhist/chanzai_order/mock/order_list_server.json',
        '/src/buddhist/chanzai_order/mock/order_list.json',
      ],
      orderExcel: [
        '/zzhadmin/getConversionOrderExcel/',
        '/src/buddhist/chanzai_order/mock/order_excel_server.json',
        '/src/buddhist/chanzai_order/mock/order_excel.json',
      ],
      finishOrder: [
        '/zzhadmin/finishConversionOrder/',
        '/src/buddhist/chanzai_order/mock/finish_order_server.json',
        '/src/buddhist/chanzai_order/mock/finish_order.json',
      ],
      saveFeedBackImgOrRemark: [
        '/zzhadmin/updateConversionOrderRemarkAndPic/',
        '/src/buddhist/chanzai_order/mock/finish_order_server.json',
        '/src/buddhist/chanzai_order/mock/finish_order.json',
      ],
      getPrinterList: [
        '/zzhadmin/getPrinterList/',
        '/src/buddhist/chanzai_order/mock/get_printer_list_server.json',
        '/src/buddhist/chanzai_order/mock/get_printer_list.json',
      ],
      getPrinterStatus: [
        '/zzhadmin/getPrinterStatus/',
        '/src/buddhist/chanzai_order/mock/get_printer_status_server.json',
        '/src/buddhist/chanzai_order/mock/get_printer_status.json',
      ],
      getPrinter: [
        '/zzhadmin/getConversionOrderPrinter/',
        '/src/buddhist/chanzai_order/mock/get_printer_server.json',
        '/src/buddhist/chanzai_order/mock/get_printer.json',
      ],
      updatePrinter: [
        '/zzhadmin/addConversionOrderPrinter/',
        '/src/buddhist/chanzai_order/mock/update_printer_server.json',
        '/src/buddhist/chanzai_order/mock/update_printer.json',
      ],
      printOrder: [
        '/zzhadmin/printConversionOrder/',
        '/src/buddhist/chanzai_order/mock/print_order_server.json',
        '/src/buddhist/chanzai_order/mock/print_order.json',
      ],
    },
    // 请求参数
    requestKeys: {
      buddhistList: [
        requestKeysOuter.buddhistList,
        requestKeysOuter.buddhistList,
      ],
      orderList: [
        requestKeysOuter.orderList,
        requestKeysOuter.orderList,
        {
          page: 'page',
        },
      ],
      orderExcel: [requestKeysOuter.orderExcel, requestKeysOuter.orderExcel],
      finishOrder: [requestKeysOuter.finishOrder, requestKeysOuter.finishOrder],
      saveFeedBackImgOrRemark: [
        requestKeysOuter.saveFeedBackImgOrRemark,
        requestKeysOuter.saveFeedBackImgOrRemark,
      ],
      getPrinterList: [
        requestKeysOuter.getPrinterList,
        requestKeysOuter.getPrinterList,
      ],
      getPrinterStatus: [
        requestKeysOuter.getPrinterStatus,
        requestKeysOuter.getPrinterStatus,
      ],
      getPrinter: [requestKeysOuter.getPrinter, requestKeysOuter.getPrinter],
      updatePrinter: [
        requestKeysOuter.updatePrinter,
        requestKeysOuter.updatePrinter,
      ],
      printOrder: [requestKeysOuter.printOrder, requestKeysOuter.printOrder],
    },
    // 重新格式化json数据
    responseRefactor: {
      buddhistList: [
        responseRefactorOuter.buddhistList,
        responseRefactorOuter.buddhistList,
      ],
      list: [responseRefactorOuter.list, responseRefactorOuter.list],
    },
    //ajax请求前置处理
    preHandle: {
      list: [preHandleOuter.list, preHandleOuter.list],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      list: [postHandleOuter.list, postHandleOuter.list],
    },
  });
});
