import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeys = {
  list: {
    page: 'pageNumber',
    startDate: 'startTime',
    endDate: 'endTime',
  },
};
var responseRefactor = {
  state: {
    totalDonate: 'priceSum',
    monthDonate: 'priceMonthSum',
    dayDonate: 'priceDaySum',
  },
  list: {
    data: [
      {
        nickname: 'nickName',
        avatar: 'headImg',
        amount: 'price',
        time: 'addTime',
      },
    ],
  },
};
var preHandle = {
  list: function(data) {
    data.pageNumber -= 1;
    data.pageSize = 20;
  },
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
  },
  list: function(res) {
    res.totalPages = Math.ceil((res.total || 1) / 20);
  },
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    state: 'state',
    list: 'list',
    download: 'download',
  },
  url: {
    state: [
      '/zzhadmin/meritBoxSumGet/',
      '/src/temple/donate_box/mock/state_server.json',
      '/src/temple/donate_box/mock/state.json',
    ],
    list: [
      '/zzhadmin/meritBoxGetList/',
      '/src/temple/donate_box/mock/list_server.json',
      '/src/temple/donate_box/mock/list.json',
    ],
  },
  requestKeys: {
    list: [
      requestKeys.list,
      requestKeys.list,
      {
        page: 'page',
        startDate: 'startDate',
        endDate: 'endDate',
      },
    ],
  },
  responseRefactor: {
    state: [responseRefactor.state, responseRefactor.state],
    list: [responseRefactor.list, responseRefactor.list],
  },
  preHandle: {
    list: [preHandle.list, preHandle.list],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    list: [postHandle.list, postHandle.list],
  },
});
