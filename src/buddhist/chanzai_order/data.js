/**
 * Created by kang on 2017/8/3.
 */

define(['common/env_data'], function(envData) {
  var data = {
    currentPage: '',
    getOrderListParams: {
      pageNumber: 0,
      type: 1, // 1获取未处理订单 2获取已处理订单
      mobile: '',
      buddhistId: 0,
      startTime: '',
      endTime: '',
    },
    orderListRes: {},
    getOrderExcelParams: {
      type: 1, // 1获取未处理订单 2获取已处理订单
      mobile: '',
      startTime: '',
      endTime: '',
    },
    finishOrderParams: {
      orderIds: [],
      pics: '',
      remark: '',
    },
    saveFeedBackImgOrRemark: {
      orderIds: [],
      pics: '',
      remark: '',
    },
    updatePrinterParams: {
      printerIdList: [
        //     {
        //         'printerSn':'',
        //         'continuousPrintNum':'',
        //         'qrcodePrint':'',
        //         'isPrintMobile':''
        //     }
      ],
    },
    getPrinterRes: {},
    printOrderParams: {
      orderIdList: [],
      printerIdList: [],
      printNum: '',
      qrcodePrint: '',
      isPrintMobile: '',
    },
  };

  return data;
});
