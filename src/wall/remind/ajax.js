/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    onlineOrders: {
      regionId: 'wallId',
      remainDays: 'endDays',
      page: 'pageIndex',
    },
    customOrders: {
      regionId: 'wallId',
      remainDays: 'endDays',
      page: 'pageIndex',
    },
    send: {
      type: 'type',
      ids: 'orderIds',
      content: 'content',
    },
    getSendInfo: {
      type: 'type',
      ids: 'orderIds',
    },
  };
  var responseRefactorOuter = {
    messageInfo: {
      remainCount: 'data.msgCnt',
    },
    onlineOrders: {
      data: [
        {
          name: 'buddhaName',
          remainDays: 'endDays',
          sendCount: 'sendMsgNum',
          time: 'sendMsgTime',
        },
      ],
    },
    customOrders: {
      data: [
        {
          name: 'buddhaName',
          remainDays: 'endDays',
          sendCount: 'sendMsgNum',
          time: 'sendMsgTime',
        },
      ],
    },
    getSendInfo: {
      phones: 'mobiles',
    },
  };
  var preHandleOuter = {
    onlineOrders: function(req) {
      req.pageSize = 20;
      req.pageIndex -= 1;
      !req.endDays && req.endDays !== 0 && (req.endDays = 99999);
    },
    customOrders: function(req) {
      console.log(req);
      req.pageSize = 20;
      req.pageIndex -= 1;
      !req.endDays && req.endDays !== 0 && (req.endDays = 99999);
    },
  };
  var postHandleOuter = {
    common: function(res) {
      res.success = res.result >= 0;
      res.msg && (res.message = res.msg);
    },
    onlineOrders: function(res) {
      res.totalPages = res.total ? Math.ceil(res.total / 20) : 1;
    },
    customOrders: function(res) {
      res.totalPages = res.total ? Math.ceil(res.total / 20) : 1;
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 短信信息
      messageInfo: 'messageInfo',
      // 区域列表
      regions: 'regions',
      // 线上订单列表
      onlineOrders: 'onlineOrders',
      // 自录订单列表
      customOrders: 'customOrders',
      // 发送通知
      send: 'send',
      // 获取群发信息
      getSendInfo: 'getSendInfo',
    },
    //url请求地址
    url: {
      messageInfo: [
        '/zzhadmin/volunteer_getSmsCount/',
        '/src/wall/remind/mock/message_info_server.json',
        '/src/wall/remind/mock/message_info.json',
      ],
      regions: [
        '/zzhadmin/buddhaWallWallList/',
        '/src/wall/remind/mock/regions_server.json',
        '/src/wall/remind/mock/regions.json',
      ],
      onlineOrders: [
        '/zzhadmin/buddhaWall_orderList/?filterType=3',
        '/src/wall/remind/mock/online_orders_server.json',
        '/src/wall/remind/mock/online_orders.json',
      ],
      customOrders: [
        '/zzhadmin/buddhaWall_recordList/',
        '/src/wall/remind/mock/custom_orders_server.json',
        '/src/wall/remind/mock/custom_orders.json',
      ],
      send: [
        '/zzhadmin/buddhaWall_sendMsg/',
        '/src/wall/remind/mock/send_server.json',
        '/src/wall/remind/mock/send.json',
      ],
      getSendInfo: [
        '/zzhadmin/buddhaWall_preSendMsg/',
        '/src/wall/remind/mock/get_send_info_server.json',
        '/src/wall/remind/mock/get_send_info.json',
      ],
    },
    // 请求参数
    requestKeys: {
      onlineOrders: [
        requestKeysOuter.onlineOrders,
        requestKeysOuter.onlineOrders,
        {
          regionId: 'regionId',
          remainDays: 'remainDays',
          page: 'page',
        },
      ],
      customOrders: [
        requestKeysOuter.customOrders,
        requestKeysOuter.customOrders,
        {
          regionId: 'regionId',
          remainDays: 'remainDays',
          page: 'page',
        },
      ],
      send: [
        requestKeysOuter.send,
        requestKeysOuter.send,
        {
          type: 'type',
          ids: 'ids',
          content: 'content',
        },
      ],
      getSendInfo: [
        requestKeysOuter.getSendInfo,
        requestKeysOuter.getSendInfo,
        {
          type: 'type',
          ids: 'ids',
        },
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      messageInfo: [
        responseRefactorOuter.messageInfo,
        responseRefactorOuter.messageInfo,
      ],
      onlineOrders: [
        responseRefactorOuter.onlineOrders,
        responseRefactorOuter.onlineOrders,
      ],
      customOrders: [
        responseRefactorOuter.customOrders,
        responseRefactorOuter.customOrders,
      ],
      getSendInfo: [
        responseRefactorOuter.getSendInfo,
        responseRefactorOuter.getSendInfo,
      ],
    },
    //ajax请求前置处理
    preHandle: {
      onlineOrders: [preHandleOuter.onlineOrders, preHandleOuter.onlineOrders],
      customOrders: [preHandleOuter.customOrders, preHandleOuter.customOrders],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      onlineOrders: [
        postHandleOuter.onlineOrders,
        postHandleOuter.onlineOrders,
      ],
      customOrders: [
        postHandleOuter.customOrders,
        postHandleOuter.customOrders,
      ],
    },
  });
});
