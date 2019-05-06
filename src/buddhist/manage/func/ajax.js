/**
 * Created by kang on 2017/9/18.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    // 左侧本地，右侧服务器
    getBuddhistType: {},
    getList: {
      typeId: 'typeId', // 佛事分类
      filterType: 'filterType', // 佛事状态
      searchText: 'searchText', // 查询文本
      orderByJoinNum: 'orderByJoinNum', //参与人次排序
      orderByCollectMoney: 'orderByCollectMoney', //募集金额排序
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
    // 左侧本地数据名称，右侧服务器名称
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
      // 图片数组转字符串
      reqData.img = reqData.img.join(',');
      // 视频数组转字符串
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
        // 图片字符串转数组
        if (item.img) {
          item.img = item.img.split(',');
        } else {
          item.img = [];
        }
        // 视频字符串转数组
        if (item.video) {
          item.video = item.video.split(',');
        } else {
          item.video = [];
        }
      });
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      getBuddhistType: 'getBuddhistType', // 获取佛事类型列表
      getList: 'getList', // 获取佛事列表
      deleteItem: 'deleteItem', // 删除佛事
      addTemplate: 'addTemplate', // 添加模板
      endItem: 'endItem', // 设为结束
      printerList: 'printerList', // 打印机列表
      printerStatus: 'printerStatus', // 打印机状态
      CommoditySubdivide: 'CommoditySubdivide', //  佛事的绑定规格
      CommodityPrinter: 'CommodityPrinter', // 佛事的打印机配置
      addAndUpdateCommodity2Printer: 'addAndUpdateCommodity2Printer', // 保存打印机配置
      getBuddhistPoster: 'getBuddhistPoster', // 获取佛事海报信息
      getBuddhistSchedule: 'getBuddhistSchedule', // 获取佛事进度
      updateBuddhistSchedule: 'updateBuddhistSchedule', // 新建或更新佛事进度
    },
    //url请求地址
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
        // 佛事的所有规格
        '/zzhadmin/getCommoditySubdivide/',
        '/src/buddhist/manage/mock/commodity_subbidivide_server.json',
        '/src/buddhist/manage/mock/commodity_subbidivide.json',
      ],
      CommodityPrinter: [
        // 佛事的打印机配置
        '/zzhadmin/getCommodityPrinter/',
        '/src/buddhist/manage/mock/commodity_printer_server.json',
        '/src/buddhist/manage/mock/commodity_printer.json',
      ],
      addAndUpdateCommodity2Printer: [
        // 保存打印机配置
        '/zzhadmin/addAndUpdateCommodity2Printer/',
        '/src/buddhist/manage/mock/commodity_printer_server.json',
        '/src/buddhist/manage/mock/commodity_printer.json',
      ],
      getBuddhistPoster: [
        // 获取佛事海报信息
        '/zzhadmin/getCeremonyPoster/',
        '',
        '',
      ],
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
    },
    // 请求参数
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
    // 重新格式化json数据
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
    //ajax请求前置处理
    preHandle: {
      getList: [preHandleOuter.getList, preHandleOuter.getList],
      updateBuddhistSchedule: [
        preHandleOuter.updateBuddhistSchedule,
        preHandleOuter.updateBuddhistSchedule,
      ],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      getList: [postHandleOuter.getList, postHandleOuter.getList],
      getBuddhistSchedule: [
        postHandleOuter.getBuddhistSchedule,
        postHandleOuter.getBuddhistSchedule,
      ],
    },
  });
});
