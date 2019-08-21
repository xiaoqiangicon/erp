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
const configs = {
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
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('messageInfo', {
  url: configs.url.messageInfo,
  requestKeys: configs.requestKeys.messageInfo,
  preHandle: configs.preHandle.messageInfo,
  responseRefactor: configs.responseRefactor.messageInfo,
  postHandle: configs.postHandle.messageInfo,
});

seeAjax.config('regions', {
  url: configs.url.regions,
  requestKeys: configs.requestKeys.regions,
  preHandle: configs.preHandle.regions,
  responseRefactor: configs.responseRefactor.regions,
  postHandle: configs.postHandle.regions,
});

seeAjax.config('onlineOrders', {
  url: configs.url.onlineOrders,
  requestKeys: configs.requestKeys.onlineOrders,
  preHandle: configs.preHandle.onlineOrders,
  responseRefactor: configs.responseRefactor.onlineOrders,
  postHandle: configs.postHandle.onlineOrders,
});

seeAjax.config('customOrders', {
  url: configs.url.customOrders,
  requestKeys: configs.requestKeys.customOrders,
  preHandle: configs.preHandle.customOrders,
  responseRefactor: configs.responseRefactor.customOrders,
  postHandle: configs.postHandle.customOrders,
});

seeAjax.config('send', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.send,
  requestKeys: configs.requestKeys.send,
  preHandle: configs.preHandle.send,
  responseRefactor: configs.responseRefactor.send,
  postHandle: configs.postHandle.send,
});

seeAjax.config('getSendInfo', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.getSendInfo,
  requestKeys: configs.requestKeys.getSendInfo,
  preHandle: configs.preHandle.getSendInfo,
  responseRefactor: configs.responseRefactor.getSendInfo,
  postHandle: configs.postHandle.getSendInfo,
});
