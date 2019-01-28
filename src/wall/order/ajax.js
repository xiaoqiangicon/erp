/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lunar-calendar', 'lib/jquery.seeAjax'], function(
  $,
  LunarCalendar
) {
  var printTexts = ['未打印', '已打印'];

  var requestKeysOuter = {
    unhandledOrders: {
      regionId: 'wallId',
      startDate: 'beginDate',
      endDate: 'endDate',
      search: 'searchText',
      searchType: 'searchType',
      page: 'pageIndex',
    },
    handledOrders: {
      regionId: 'wallId',
      startDate: 'beginDate',
      endDate: 'endDate',
      search: 'searchText',
      searchType: 'searchType',
      page: 'pageIndex',
    },
    handle: {
      id: 'id',
      type: 'status',
      image: 'pic',
    },
    detail: {
      id: 'id',
    },
    saveMemo: {
      id: 'id',
      memo: 'memo',
    },
    updateFeedImage: {
      id: 'id',
      type: 'status',
      image: 'pic',
    },
    printerStatus: {
      id: 'printerId',
    },
    savePrinter: {
      ids: 'orderIdList',
      printers: 'printerIdList',
      printType: 'qrcodePrint',
      printPages: 'printNum',
    },
  };
  var responseRefactorOuter = {
    unhandledOrders: {
      data: [
        {
          name: 'buddhaName',
          money: 'price',
          type: 'supplyType',
          time: 'addTime',
          printed: 'isPrint',
        },
      ],
    },
    handledOrders: {
      data: [
        {
          name: 'buddhaName',
          money: 'price',
          type: 'supplyType',
          time: 'addTime',
          printed: 'isPrint',
        },
      ],
    },
    detail: {
      data: {
        name: 'buddhaName',
        sequence: 'number',
        time: 'addTime',
        money: 'price',
        type: 'supplyType',
        orderNumber: 'transactionId',
        flowNumber: 'prepayId',
        feedImage: 'dispose_pic_url',
        contactList: [
          {
            phone: 'mobile',
            birth: 'birthday',
            lunar: 'isLunar',
          },
        ],
        yangShangRen: 'alivePeople',
        wangShengZhe: 'deadman',
      },
    },
    printers: {
      data: [
        {
          name: 'address',
        },
      ],
    },
  };
  var preHandleOuter = {
    unhandledOrders: function(req) {
      req.pageSize = 20;
      req.pageIndex -= 1;

      var search = req.searchText;

      req.searchText = '';
      req.mobile = '';
      req.contactName = '';
      if (req.searchType === 1) req.mobile = search;
      else if (req.searchType === 2) req.contactName = search;
      else req.searchText = search;

      delete req.searchType;
    },
    handledOrders: function(req) {
      req.pageSize = 20;
      req.pageIndex -= 1;

      var search = req.searchText;

      req.searchText = '';
      req.mobile = '';
      req.contactName = '';
      if (req.searchType === 1) req.mobile = search;
      else if (req.searchType === 2) req.contactName = search;
      else req.searchText = search;

      delete req.searchType;
    },
  };
  var postHandleOuter = {
    common: function(res) {
      res.success = res.result >= 0;
      res.msg && (res.message = res.msg);
    },
    regions: function(res) {
      res.data &&
        res.data.length &&
        res.data.map(function(item) {
          var nameArray = item.name.split('-');
          // 把第一个去掉
          nameArray.shift();
          // 产品要求把前面的大殿名去掉
          item.shortedName = nameArray.join('-');
        });
    },
    unhandledOrders: function(res) {
      res.totalPages = res.total ? Math.ceil(res.total / 20) : 1;
      res.totalCount = res.total;

      res.data &&
        res.data.length &&
        res.data.map(function(item) {
          var contactNames = [];
          item.contactList &&
            item.contactList.length &&
            item.contactList.map(function(contactItem) {
              contactNames.push(contactItem.name);
            });
          item.contactNames = contactNames.join('<br>');

          item.printText = printTexts[item.printed || 0];
        });
    },
    handledOrders: function(res) {
      res.totalPages = res.total ? Math.ceil(res.total / 20) : 1;

      res.data &&
        res.data.length &&
        res.data.map(function(item) {
          var contactNames = [];
          item.contactList &&
            item.contactList.length &&
            item.contactList.map(function(contactItem) {
              contactNames.push(contactItem.name);
            });
          item.contactNames = contactNames.join('<br>');

          item.printText = printTexts[item.printed || 0];
        });
    },
    detail: function(res) {
      res.data.contactList &&
        res.data.contactList.map(function(item) {
          if (item.birth) {
            var birthData = item.birth.split('-');
            var year = parseInt(birthData[0]);
            var month = parseInt(birthData[1]);
            var day = parseInt(birthData[2]);

            if (item.lunar) {
              var lunarData = LunarCalendar.solarToLunar(year, month, day);
              item.birth =
                lunarData.lunarYear +
                '-' +
                (lunarData.lunarMonth > 9
                  ? lunarData.lunarMonth
                  : '0' + lunarData.lunarMonth) +
                '-' +
                (lunarData.lunarDay > 9
                  ? lunarData.lunarDay
                  : '0' + lunarData.lunarDay);
            }
          }
        });
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 大殿列表
      houses: 'houses',
      // 区域列表
      regions: 'regions',
      // 未处理订单列表
      unhandledOrders: 'unhandledOrders',
      // 已处理订单列表
      handledOrders: 'handledOrders',
      // 处理订单
      handle: 'handle',
      // 获取某个订单的详细信息
      detail: 'detail',
      // 保存备注信息
      saveMemo: 'saveMemo',
      // 更新反馈图片
      updateFeedImage: 'updateFeedImage',
      // 打印机列表
      printers: 'printers',
      // 获取打印机状态
      printerStatus: 'printerStatus',
      // 保存打印机设置
      savePrinter: 'savePrinter',
    },
    //url请求地址
    url: {
      houses: [
        '/zzhadmin/buddhaWall_hallList/',
        '/src/wall/record/mock/houses_server.json',
        '/src/wall/record/mock/houses.json',
      ],
      regions: [
        '/zzhadmin/buddhaWallWallList/',
        '/src/wall/remind/mock/regions_server.json',
        '/src/wall/remind/mock/regions.json',
      ],
      unhandledOrders: [
        '/zzhadmin/buddhaWall_orderList/?filterType=1',
        '/src/wall/order/mock/unhandled_orders_server.json',
        '/src/wall/order/mock/unhandled_orders.json',
      ],
      handledOrders: [
        '/zzhadmin/buddhaWall_orderList/?filterType=2',
        '/src/wall/order/mock/handled_orders_server.json',
        '/src/wall/order/mock/handled_orders.json',
      ],
      handle: [
        '/zzhadmin/buddhaWall_dealOrder/',
        '/src/wall/order/mock/handle_server.json',
        '/src/wall/order/mock/handle.json',
      ],
      detail: [
        '/zzhadmin/buddhaWall_getOrder/',
        '/src/wall/order/mock/detail_server.json',
        '/src/wall/order/mock/detail.json',
      ],
      saveMemo: [
        '/zzhadmin/buddhaWall_editMemo/',
        '/src/wall/order/mock/save_memo_server.json',
        '/src/wall/order/mock/save_memo.json',
      ],
      updateFeedImage: [
        '/zzhadmin/buddhaWall_dealOrder/',
        '/src/wall/order/mock/update_feed_image_server.json',
        '/src/wall/order/mock/update_feed_image.json',
      ],
      printers: [
        '/zzhadmin/getPrinterList/',
        '/src/wall/set/mock/printers_server.json',
        '/src/wall/set/mock/printers.json',
      ],
      printerStatus: [
        '/zzhadmin/getPrinterStatus/',
        '/src/wall/set/mock/printer_status_server.json',
        '/src/wall/set/mock/printer_status.json',
      ],
      savePrinter: [
        '/zzhadmin/print_appoint_wall_order/',
        '/src/wall/order/mock/save_printer_server.json',
        '/src/wall/order/mock/save_printer.json',
      ],
    },
    // 请求参数
    requestKeys: {
      unhandledOrders: [
        requestKeysOuter.unhandledOrders,
        requestKeysOuter.unhandledOrders,
        {
          regionId: 'regionId',
          startDate: 'startDate',
          endDate: 'endDate',
          search: 'search',
          searchType: 'searchType',
          page: 'page',
        },
      ],
      handledOrders: [
        requestKeysOuter.handledOrders,
        requestKeysOuter.handledOrders,
        {
          regionId: 'regionId',
          startDate: 'startDate',
          endDate: 'endDate',
          search: 'search',
          searchType: 'searchType',
          page: 'page',
        },
      ],
      handle: [
        requestKeysOuter.handle,
        requestKeysOuter.handle,
        {
          id: 'id',
          // 0: 设为已处理，1：设为未处理
          type: 'type',
          // 由于更新图片接口与处理接口后台合并成一个接口，所以这里加一个冗余字段
          image: 'image',
        },
      ],
      detail: [
        requestKeysOuter.detail,
        requestKeysOuter.detail,
        {
          id: 'id',
        },
      ],
      saveMemo: [
        requestKeysOuter.saveMemo,
        requestKeysOuter.saveMemo,
        {
          id: 'id',
          memo: 'memo',
        },
      ],
      updateFeedImage: [
        requestKeysOuter.updateFeedImage,
        requestKeysOuter.updateFeedImage,
        {
          id: 'id',
          type: 'status',
          image: 'image',
        },
      ],
      printerStatus: [
        requestKeysOuter.printerStatus,
        requestKeysOuter.printerStatus,
        {
          id: 'id',
        },
      ],
      savePrinter: [
        requestKeysOuter.savePrinter,
        requestKeysOuter.savePrinter,
        {
          ids: 'ids',
          printers: 'printers',
          printType: 'printType',
          printPages: 'printPages',
        },
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      unhandledOrders: [
        responseRefactorOuter.unhandledOrders,
        responseRefactorOuter.unhandledOrders,
      ],
      handledOrders: [
        responseRefactorOuter.handledOrders,
        responseRefactorOuter.handledOrders,
      ],
      detail: [responseRefactorOuter.detail, responseRefactorOuter.detail],
      printers: [
        responseRefactorOuter.printers,
        responseRefactorOuter.printers,
      ],
    },
    //ajax请求前置处理
    preHandle: {
      unhandledOrders: [
        preHandleOuter.unhandledOrders,
        preHandleOuter.unhandledOrders,
      ],
      handledOrders: [
        preHandleOuter.handledOrders,
        preHandleOuter.handledOrders,
      ],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      regions: [postHandleOuter.regions, postHandleOuter.regions],
      unhandledOrders: [
        postHandleOuter.unhandledOrders,
        postHandleOuter.unhandledOrders,
      ],
      handledOrders: [
        postHandleOuter.handledOrders,
        postHandleOuter.handledOrders,
      ],
      detail: [postHandleOuter.detail, postHandleOuter.detail],
    },
  });
});
