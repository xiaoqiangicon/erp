import $ from 'jquery';
import LunarCalendar from 'lunar-calendar';
import seeAjax from 'see-ajax';
var printTexts = ['未打印', '已打印'];
var requestKeys = {
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
var responseRefactor = {
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
var preHandle = {
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
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    res.msg && (res.message = res.msg);
  },
  regions: function(res) {
    res.data &&
      res.data.length &&
      res.data.map(function(item) {
        var nameArray = item.name.split('-');
        nameArray.shift();
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
const configs = {
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
  requestKeys: {
    unhandledOrders: [
      requestKeys.unhandledOrders,
      requestKeys.unhandledOrders,
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
      requestKeys.handledOrders,
      requestKeys.handledOrders,
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
      requestKeys.handle,
      requestKeys.handle,
      {
        id: 'id',
        type: 'type',
        image: 'image',
      },
    ],
    detail: [
      requestKeys.detail,
      requestKeys.detail,
      {
        id: 'id',
      },
    ],
    saveMemo: [
      requestKeys.saveMemo,
      requestKeys.saveMemo,
      {
        id: 'id',
        memo: 'memo',
      },
    ],
    updateFeedImage: [
      requestKeys.updateFeedImage,
      requestKeys.updateFeedImage,
      {
        id: 'id',
        type: 'status',
        image: 'image',
      },
    ],
    printerStatus: [
      requestKeys.printerStatus,
      requestKeys.printerStatus,
      {
        id: 'id',
      },
    ],
    savePrinter: [
      requestKeys.savePrinter,
      requestKeys.savePrinter,
      {
        ids: 'ids',
        printers: 'printers',
        printType: 'printType',
        printPages: 'printPages',
      },
    ],
  },
  responseRefactor: {
    unhandledOrders: [
      responseRefactor.unhandledOrders,
      responseRefactor.unhandledOrders,
    ],
    handledOrders: [
      responseRefactor.handledOrders,
      responseRefactor.handledOrders,
    ],
    detail: [responseRefactor.detail, responseRefactor.detail],
    printers: [responseRefactor.printers, responseRefactor.printers],
  },
  preHandle: {
    unhandledOrders: [preHandle.unhandledOrders, preHandle.unhandledOrders],
    handledOrders: [preHandle.handledOrders, preHandle.handledOrders],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    regions: [postHandle.regions, postHandle.regions],
    unhandledOrders: [postHandle.unhandledOrders, postHandle.unhandledOrders],
    handledOrders: [postHandle.handledOrders, postHandle.handledOrders],
    detail: [postHandle.detail, postHandle.detail],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('houses', {
  url: configs.url.houses,
  requestKeys: configs.requestKeys.houses,
  preHandle: configs.preHandle.houses,
  responseRefactor: configs.responseRefactor.houses,
  postHandle: configs.postHandle.houses,
});

seeAjax.config('regions', {
  url: configs.url.regions,
  requestKeys: configs.requestKeys.regions,
  preHandle: configs.preHandle.regions,
  responseRefactor: configs.responseRefactor.regions,
  postHandle: configs.postHandle.regions,
});

seeAjax.config('unhandledOrders', {
  url: configs.url.unhandledOrders,
  requestKeys: configs.requestKeys.unhandledOrders,
  preHandle: configs.preHandle.unhandledOrders,
  responseRefactor: configs.responseRefactor.unhandledOrders,
  postHandle: configs.postHandle.unhandledOrders,
});

seeAjax.config('handledOrders', {
  url: configs.url.handledOrders,
  requestKeys: configs.requestKeys.handledOrders,
  preHandle: configs.preHandle.handledOrders,
  responseRefactor: configs.responseRefactor.handledOrders,
  postHandle: configs.postHandle.handledOrders,
});

seeAjax.config('handle', {
  method: ['post'],
  url: configs.url.handle,
  requestKeys: configs.requestKeys.handle,
  preHandle: configs.preHandle.handle,
  responseRefactor: configs.responseRefactor.handle,
  postHandle: configs.postHandle.handle,
});

seeAjax.config('detail', {
  url: configs.url.detail,
  requestKeys: configs.requestKeys.detail,
  preHandle: configs.preHandle.detail,
  responseRefactor: configs.responseRefactor.detail,
  postHandle: configs.postHandle.detail,
});

seeAjax.config('saveMemo', {
  url: configs.url.saveMemo,
  requestKeys: configs.requestKeys.saveMemo,
  preHandle: configs.preHandle.saveMemo,
  responseRefactor: configs.responseRefactor.saveMemo,
  postHandle: configs.postHandle.saveMemo,
});

seeAjax.config('updateFeedImage', {
  method: ['post'],
  url: configs.url.updateFeedImage,
  requestKeys: configs.requestKeys.updateFeedImage,
  preHandle: configs.preHandle.updateFeedImage,
  responseRefactor: configs.responseRefactor.updateFeedImage,
  postHandle: configs.postHandle.updateFeedImage,
});

seeAjax.config('printers', {
  url: configs.url.printers,
  requestKeys: configs.requestKeys.printers,
  preHandle: configs.preHandle.printers,
  responseRefactor: configs.responseRefactor.printers,
  postHandle: configs.postHandle.printers,
});

seeAjax.config('printerStatus', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.printerStatus,
  requestKeys: configs.requestKeys.printerStatus,
  preHandle: configs.preHandle.printerStatus,
  responseRefactor: configs.responseRefactor.printerStatus,
  postHandle: configs.postHandle.printerStatus,
});

seeAjax.config('savePrinter', {
  method: ['post'],
  url: configs.url.savePrinter,
  requestKeys: configs.requestKeys.savePrinter,
  preHandle: configs.preHandle.savePrinter,
  responseRefactor: configs.responseRefactor.savePrinter,
  postHandle: configs.postHandle.savePrinter,
});
