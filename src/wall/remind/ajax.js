import $ from 'jquery';
import 'lib/jquery.seeAjax';
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
  environment: __SEE_ENV__,
  name: {
    messageInfo: 'messageInfo',
    regions: 'regions',
    onlineOrders: 'onlineOrders',
    customOrders: 'customOrders',
    send: 'send',
    getSendInfo: 'getSendInfo',
  },
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
  preHandle: {
    onlineOrders: [preHandleOuter.onlineOrders, preHandleOuter.onlineOrders],
    customOrders: [preHandleOuter.customOrders, preHandleOuter.customOrders],
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    onlineOrders: [postHandleOuter.onlineOrders, postHandleOuter.onlineOrders],
    customOrders: [postHandleOuter.customOrders, postHandleOuter.customOrders],
  },
});
