import $ from 'jquery';
import seeAjax from 'see-ajax';
var requestKeys = {
  getList: {
    pageNum: 'pageNumber',
    pageSize: 'pageSize',
    beginDate: 'startTime',
    endDate: 'endTime',
  },
  getCash: {},
};
var responseRefactor = {
  getList: {
    data: [
      {
        src: 'headImg',
        name: 'nickName',
        tributes: 'source',
        money: 'price',
        addTime: 'addTime',
        payTime: 'payTime',
        wish: 'wish',
      },
    ],
  },
  getCash: {
    total: 'priceSum',
    month: 'priceMonthSum',
    day: 'priceDaySum',
  },
};
var preHandle = {
  getList: function(data) {
    data.pageSize = 20;
  },
  getCash: function(data) {},
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
  },
};
const configs = {
  url: {
    getList: [
      '/zzhadmin/vr_recordList/',
      '/src/vrshow/tributes_record/mock/get_list_server.json',
      '/src/vrshow/tributes_record/mock/get_list_server.json',
    ],
    getCash: [
      '/zzhadmin/vr_recordSum/',
      '/src/vrshow/tributes_record/mock/get_cash_server.json',
      '/src/vrshow/tributes_record/mock/get_cash_server.json',
    ],
  },
  requestKeys: {
    getList: [requestKeys.getList, requestKeys.getList, requestKeys.getList],
  },
  responseRefactor: {
    getList: [responseRefactor.getList, responseRefactor.getList],
    getCash: [responseRefactor.getCash, responseRefactor.getCash],
  },
  preHandle: {
    getList: [preHandle.getList, preHandle.getList],
    getCash: [preHandle.getCash, preHandle.getCash],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('getList', {
  url: configs.url.getList,
  requestKeys: configs.requestKeys.getList,
  preHandle: configs.preHandle.getList,
  responseRefactor: configs.responseRefactor.getList,
  postHandle: configs.postHandle.getList,
});

seeAjax.config('getCash', {
  url: configs.url.getCash,
  requestKeys: configs.requestKeys.getCash,
  preHandle: configs.preHandle.getCash,
  responseRefactor: configs.responseRefactor.getCash,
  postHandle: configs.postHandle.getCash,
});
