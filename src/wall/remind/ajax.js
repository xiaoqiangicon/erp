import $ from 'jquery';
import seeAjax from 'see-ajax';
var requestKeys = {
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
var responseRefactor = {
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
var preHandle = {
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
var postHandle = {
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
      requestKeys.onlineOrders,
      requestKeys.onlineOrders,
      {
        regionId: 'regionId',
        remainDays: 'remainDays',
        page: 'page',
      },
    ],
    customOrders: [
      requestKeys.customOrders,
      requestKeys.customOrders,
      {
        regionId: 'regionId',
        remainDays: 'remainDays',
        page: 'page',
      },
    ],
    send: [
      requestKeys.send,
      requestKeys.send,
      {
        type: 'type',
        ids: 'ids',
        content: 'content',
      },
    ],
    getSendInfo: [
      requestKeys.getSendInfo,
      requestKeys.getSendInfo,
      {
        type: 'type',
        ids: 'ids',
      },
    ],
  },
  responseRefactor: {
    messageInfo: [responseRefactor.messageInfo, responseRefactor.messageInfo],
    onlineOrders: [
      responseRefactor.onlineOrders,
      responseRefactor.onlineOrders,
    ],
    customOrders: [
      responseRefactor.customOrders,
      responseRefactor.customOrders,
    ],
    getSendInfo: [responseRefactor.getSendInfo, responseRefactor.getSendInfo],
  },
  preHandle: {
    onlineOrders: [preHandle.onlineOrders, preHandle.onlineOrders],
    customOrders: [preHandle.customOrders, preHandle.customOrders],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    onlineOrders: [postHandle.onlineOrders, postHandle.onlineOrders],
    customOrders: [postHandle.customOrders, postHandle.customOrders],
  },
});
