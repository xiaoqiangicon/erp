import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeysOuter = {
  getBuddhistType: {},
  getList: {
    typeId: 'typeId',
    filterType: 'filterType',
    searchText: 'searchText',
    orderByJoinNum: 'orderByJoinNum',
    orderByCollectMoney: 'orderByCollectMoney',
    page: 'pageIndex',
    pageSize: 'pageSize',
  },
  deleteItem: {
    id: 'id',
  },
  addTemplate: {
    commodityId: 'commodityId',
    name: 'name',
  },
  endItem: {
    commodityId: 'commodityId',
  },
  printerList: {},
  printerStatus: {
    printerId: 'printerId',
  },
  CommoditySubdivide: {
    commodityId: 'commodityId',
  },
  CommodityPrinter: {
    commodityId: 'commodityId',
  },
  addAndUpdateCommodity2Printer: {
    commodityId: 'commodityId',
    continuousPrintNum: 'continuousPrintNum',
    isOpenPrinter: 'isOpenPrinter',
    isPrintMobile: 'isPrintMobile',
    printerId: 'printerId',
    qrcodePrint: 'qrcodePrint',
    subdividePrinter: 'subdividePrinter',
  },
  getBuddhistPoster: {
    commodityId: 'commodityId',
    title: 'title',
  },
  getBuddhistSchedule: {
    buddhistId: 'commodityId',
    page: 'pageIndex',
    pageSize: 'pageSize',
  },
  updateBuddhistSchedule: {
    buddhistId: 'commodityId',
    scheduleId: 'scheduleId',
    content: 'content',
    img: 'img',
    video: 'video',
    isShow: 'isShow',
  },
};
var responseRefactorOuter = {
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
var preHandleOuter = {
  getList: function(reqData) {},
  updateBuddhistSchedule: function(reqData) {
    reqData.img = reqData.img.join(',');
    reqData.video = reqData.video.join(',');
  },
};
var postHandleOuter = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
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
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    getBuddhistType: 'getBuddhistType',
    getList: 'getList',
    deleteItem: 'deleteItem',
    addTemplate: 'addTemplate',
    endItem: 'endItem',
    printerList: 'printerList',
    printerStatus: 'printerStatus',
    CommoditySubdivide: 'CommoditySubdivide',
    CommodityPrinter: 'CommodityPrinter',
    addAndUpdateCommodity2Printer: 'addAndUpdateCommodity2Printer',
    getBuddhistPoster: 'getBuddhistPoster',
    getBuddhistSchedule: 'getBuddhistSchedule',
    updateBuddhistSchedule: 'updateBuddhistSchedule',
    getPushTimes: 'getPushTimes',
  },
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
      requestKeysOuter.getList,
      requestKeysOuter.getList,
      {
        page: 'page',
      },
    ],
    deleteItem: [requestKeysOuter.deleteItem, requestKeysOuter.deleteItem],
    addTemplate: [requestKeysOuter.addTemplate, requestKeysOuter.addTemplate],
    endItem: [requestKeysOuter.endItem, requestKeysOuter.endItem],
    printerList: [requestKeysOuter.printerList, requestKeysOuter.printerList],
    printerStatus: [
      requestKeysOuter.printerStatus,
      requestKeysOuter.printerStatus,
    ],
    CommoditySubdivide: [
      requestKeysOuter.CommoditySubdivide,
      requestKeysOuter.CommoditySubdivide,
    ],
    CommodityPrinter: [
      requestKeysOuter.CommodityPrinter,
      requestKeysOuter.CommodityPrinter,
    ],
    addAndUpdateCommodity2Printer: [
      requestKeysOuter.addAndUpdateCommodity2Printer,
      requestKeysOuter.addAndUpdateCommodity2Printer,
    ],
    getBuddhistPoster: [
      requestKeysOuter.getBuddhistPoster,
      requestKeysOuter.getBuddhistPoster,
    ],
    getBuddhistSchedule: [
      requestKeysOuter.getBuddhistSchedule,
      requestKeysOuter.getBuddhistSchedule,
    ],
    updateBuddhistSchedule: [
      requestKeysOuter.updateBuddhistSchedule,
      requestKeysOuter.updateBuddhistSchedule,
    ],
  },
  responseRefactor: {
    getBuddhistType: [
      responseRefactorOuter.getBuddhistType,
      responseRefactorOuter.getBuddhistType,
    ],
    getList: [responseRefactorOuter.getList, responseRefactorOuter.getList],
    getBuddhistSchedule: [
      responseRefactorOuter.getBuddhistSchedule,
      responseRefactorOuter.getBuddhistSchedule,
    ],
  },
  preHandle: {
    getList: [preHandleOuter.getList, preHandleOuter.getList],
    updateBuddhistSchedule: [
      preHandleOuter.updateBuddhistSchedule,
      preHandleOuter.updateBuddhistSchedule,
    ],
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    getList: [postHandleOuter.getList, postHandleOuter.getList],
    getBuddhistSchedule: [
      postHandleOuter.getBuddhistSchedule,
      postHandleOuter.getBuddhistSchedule,
    ],
  },
});
