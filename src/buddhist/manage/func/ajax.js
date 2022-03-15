import $ from 'jquery';
import seeAjax from 'see-ajax';
import handleAjaxError from '../../../com/handle-ajax-error';

var requestKeys = {
  getBuddhistType: {},
  getList: {
    page: 'pageIndex',
  },
  deleteItem: {},
  addTemplate: {},
  endItem: {},
  printerList: {},
  printerStatus: {},
  CommoditySubdivide: {},
  CommodityPrinter: {},
  addAndUpdateCommodity2Printer: {},
  getBuddhistPoster: {},
  getBuddhistSchedule: {
    buddhistId: 'commodityId',
    page: 'pageIndex',
  },
  updateBuddhistSchedule: {
    buddhistId: 'commodityId',
  },
};
var responseRefactor = {
  getBuddhistType: {
    data: [
      {
        ceremonyTypeId: 'ceremonyTypeId',
        name: 'name',
      },
    ],
  },
  getList: {
    ifHasPrinter: 'isHavePrinter',
    data: [
      {
        collectMoney: 'collect_money',
        endTime: 'endTime',
        id: 'id',
        isEnd: 'isEnd',
        isStart: 'isStart',
        joinNum: 'join_num',
        name: 'name',
        pic: 'pic',
        previewUrl: 'preview_url',
        price: 'price',
        printerList: 'printerList',
        status: 'status',
        wxUrl: 'wx_url',
      },
    ],
  },
  getBuddhistSchedule: {
    data: [
      {
        id: 'id',
        content: 'content',
        img: 'img',
        isShow: 'isShow',
        addTime: 'addTime',
      },
    ],
  },
};
var preHandle = {
  getList: function(reqData) {},
  updateBuddhistSchedule: function(reqData) {
    reqData.img = reqData.img.join(',');
    reqData.video = reqData.video.join(',');
  },
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);

    handleAjaxError(res);
  },
  getList: function(res) {
    res.data.map(function(item) {});
  },
  getBuddhistSchedule: function(res) {
    res.data.map(function(item) {
      if (item.img) {
        item.img = item.img.split(',');
      } else {
        item.img = [];
      }
      if (item.video) {
        item.video = item.video.split(',');
      } else {
        item.video = [];
      }
    });
  },
};

const configs = {
  url: {
    getBuddhistType: [
      '/zzhadmin/createCeremonyTypeList/',
      '/src/buddhist/manage/mock/ceremony_list_server.json',
      '/src/buddhist/manage/mock/ceremony_list.json',
    ],
    getList: [
      '/zzhadmin/managerCeremonyList/',
      '/src/buddhist/manage/mock/index_list_server.json',
      '/src/buddhist/manage/mock/index_list.json',
    ],
    deleteItem: [
      '/zzhadmin/managerDelCeremony/',
      '/src/buddhist/mock/ceremony_delete.json',
    ],
    addTemplate: ['/zzhadmin/saveCeremonyTemplate/'],
    endItem: ['/zzhadmin/endCommodity/'],
    printerList: [
      '/zzhadmin/getPrinterList/',
      '/src/buddhist/manage/mock/printer_list_server.json',
      '/src/buddhist/manage/mock/printer_list.json',
    ],
    printerStatus: [
      '/zzhadmin/getPrinterStatus/',
      '/src/buddhist/manage/mock/printer_status_server.json',
      '/src/buddhist/manage/mock/printer_status.json',
    ],
    CommoditySubdivide: [
      '/zzhadmin/getCommoditySubdivide/',
      '/src/buddhist/manage/mock/commodity_subbidivide_server.json',
      '/src/buddhist/manage/mock/commodity_subbidivide.json',
    ],
    CommodityPrinter: [
      '/zzhadmin/getCommodityPrinter/',
      '/src/buddhist/manage/mock/commodity_printer_server.json',
      '/src/buddhist/manage/mock/commodity_printer.json',
    ],
    addAndUpdateCommodity2Printer: [
      '/zzhadmin/addAndUpdateCommodity2Printer/',
      '/src/buddhist/manage/mock/commodity_printer_server.json',
      '/src/buddhist/manage/mock/commodity_printer.json',
    ],
    getBuddhistPoster: ['/zzhadmin/getCeremonyPoster/', '', ''],
    getBuddhistSchedule: [
      '/zzhadmin/getCommoditySchedule/',
      '/src/buddhist/manage/mock/commodity_schedule_server.json',
      '/src/buddhist/manage/mock/commodity_schedule.json',
    ],
    updateBuddhistSchedule: [
      '/zzhadmin/addOrUpdateCommoditySchedule/',
      '/src/buddhist/manage/mock/success_server.json',
      '/src/buddhist/manage/mock/success.json',
    ],
    getPushTimes: [
      '/zzhadmin/getPushTimes/',
      '/src/buddhist/manage/mock/get_push_times.json',
      '/src/buddhist/manage/mock/get_push_times.json',
    ],
  },
  requestKeys: {
    getList: [
      requestKeys.getList,
      requestKeys.getList,
      {
        page: 'page',
      },
    ],
    deleteItem: [requestKeys.deleteItem, requestKeys.deleteItem],
    addTemplate: [requestKeys.addTemplate, requestKeys.addTemplate],
    endItem: [requestKeys.endItem, requestKeys.endItem],
    printerList: [requestKeys.printerList, requestKeys.printerList],
    printerStatus: [requestKeys.printerStatus, requestKeys.printerStatus],
    CommoditySubdivide: [
      requestKeys.CommoditySubdivide,
      requestKeys.CommoditySubdivide,
    ],
    CommodityPrinter: [
      requestKeys.CommodityPrinter,
      requestKeys.CommodityPrinter,
    ],
    addAndUpdateCommodity2Printer: [
      requestKeys.addAndUpdateCommodity2Printer,
      requestKeys.addAndUpdateCommodity2Printer,
    ],
    getBuddhistPoster: [
      requestKeys.getBuddhistPoster,
      requestKeys.getBuddhistPoster,
    ],
    getBuddhistSchedule: [
      requestKeys.getBuddhistSchedule,
      requestKeys.getBuddhistSchedule,
    ],
    updateBuddhistSchedule: [
      requestKeys.updateBuddhistSchedule,
      requestKeys.updateBuddhistSchedule,
    ],
  },
  responseRefactor: {
    getBuddhistType: [
      responseRefactor.getBuddhistType,
      responseRefactor.getBuddhistType,
    ],
    getList: [responseRefactor.getList, responseRefactor.getList],
    getBuddhistSchedule: [
      responseRefactor.getBuddhistSchedule,
      responseRefactor.getBuddhistSchedule,
    ],
  },
  preHandle: {
    getList: [preHandle.getList, preHandle.getList],
    updateBuddhistSchedule: [
      preHandle.updateBuddhistSchedule,
      preHandle.updateBuddhistSchedule,
    ],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    getList: [postHandle.getList, postHandle.getList],
    getBuddhistSchedule: [
      postHandle.getBuddhistSchedule,
      postHandle.getBuddhistSchedule,
    ],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('getBuddhistType', {
  url: configs.url.getBuddhistType,
  requestKeys: configs.requestKeys.getBuddhistType,
  preHandle: configs.preHandle.getBuddhistType,
  responseRefactor: configs.responseRefactor.getBuddhistType,
  postHandle: configs.postHandle.getBuddhistType,
});
seeAjax.config('getList', {
  url: configs.url.getList,
  requestKeys: configs.requestKeys.getList,
  preHandle: configs.preHandle.getList,
  responseRefactor: configs.responseRefactor.getList,
  postHandle: configs.postHandle.getList,
});
seeAjax.config('deleteItem', {
  method: ['post'],
  url: configs.url.deleteItem,
  requestKeys: configs.requestKeys.deleteItem,
  preHandle: configs.preHandle.deleteItem,
  responseRefactor: configs.responseRefactor.deleteItem,
  postHandle: configs.postHandle.deleteItem,
});
seeAjax.config('addTemplate', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.addTemplate,
  requestKeys: configs.requestKeys.addTemplate,
  preHandle: configs.preHandle.addTemplate,
  responseRefactor: configs.responseRefactor.addTemplate,
  postHandle: configs.postHandle.addTemplate,
});
seeAjax.config('endItem', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.endItem,
  requestKeys: configs.requestKeys.endItem,
  preHandle: configs.preHandle.endItem,
  responseRefactor: configs.responseRefactor.endItem,
  postHandle: configs.postHandle.endItem,
});
seeAjax.config('printerList', {
  url: configs.url.printerList,
  requestKeys: configs.requestKeys.printerList,
  preHandle: configs.preHandle.printerList,
  responseRefactor: configs.responseRefactor.printerList,
  postHandle: configs.postHandle.printerList,
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
seeAjax.config('CommoditySubdivide', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.CommoditySubdivide,
  requestKeys: configs.requestKeys.CommoditySubdivide,
  preHandle: configs.preHandle.CommoditySubdivide,
  responseRefactor: configs.responseRefactor.CommoditySubdivide,
  postHandle: configs.postHandle.CommoditySubdivide,
});
seeAjax.config('CommodityPrinter', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.CommodityPrinter,
  requestKeys: configs.requestKeys.CommodityPrinter,
  preHandle: configs.preHandle.CommodityPrinter,
  responseRefactor: configs.responseRefactor.CommodityPrinter,
  postHandle: configs.postHandle.CommodityPrinter,
});
seeAjax.config('addAndUpdateCommodity2Printer', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.addAndUpdateCommodity2Printer,
  requestKeys: configs.requestKeys.addAndUpdateCommodity2Printer,
  preHandle: configs.preHandle.addAndUpdateCommodity2Printer,
  responseRefactor: configs.responseRefactor.addAndUpdateCommodity2Printer,
  postHandle: configs.postHandle.addAndUpdateCommodity2Printer,
});
seeAjax.config('getBuddhistPoster', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.getBuddhistPoster,
  requestKeys: configs.requestKeys.getBuddhistPoster,
  preHandle: configs.preHandle.getBuddhistPoster,
  responseRefactor: configs.responseRefactor.getBuddhistPoster,
  postHandle: configs.postHandle.getBuddhistPoster,
});
seeAjax.config('getBuddhistSchedule', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.getBuddhistSchedule,
  requestKeys: configs.requestKeys.getBuddhistSchedule,
  preHandle: configs.preHandle.getBuddhistSchedule,
  responseRefactor: configs.responseRefactor.getBuddhistSchedule,
  postHandle: configs.postHandle.getBuddhistSchedule,
});
seeAjax.config('updateBuddhistSchedule', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.updateBuddhistSchedule,
  requestKeys: configs.requestKeys.updateBuddhistSchedule,
  preHandle: configs.preHandle.updateBuddhistSchedule,
  responseRefactor: configs.responseRefactor.updateBuddhistSchedule,
  postHandle: configs.postHandle.updateBuddhistSchedule,
});
seeAjax.config('getPushTimes', {
  url: configs.url.getPushTimes,
  requestKeys: configs.requestKeys.getPushTimes,
  preHandle: configs.preHandle.getPushTimes,
  responseRefactor: configs.responseRefactor.getPushTimes,
  postHandle: configs.postHandle.getPushTimes,
});
