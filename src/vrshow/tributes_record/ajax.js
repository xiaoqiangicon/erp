import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeysOuter = {
  getList: {
    pageNum: 'pageNumber',
    pageSize: 'pageSize',
    beginDate: 'startTime',
    endDate: 'endTime',
  },
  getCash: {},
};
var responseRefactorOuter = {
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
var preHandleOuter = {
  getList: function(data) {
    data.pageSize = 20;
  },
  getCash: function(data) {},
};
var postHandleOuter = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
  },
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    getList: 'getList',
    getCash: 'getCash',
  },
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
    getList: [
      requestKeysOuter.getList,
      requestKeysOuter.getList,
      requestKeysOuter.getList,
    ],
  },
  responseRefactor: {
    getList: [responseRefactorOuter.getList, responseRefactorOuter.getList],
    getCash: [responseRefactorOuter.getCash, responseRefactorOuter.getCash],
  },
  preHandle: {
    getList: [preHandleOuter.getList, preHandleOuter.getList],
    getCash: [preHandleOuter.getCash, preHandleOuter.getCash],
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
  },
});
