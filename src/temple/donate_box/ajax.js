import $ from 'jquery';
import seeAjax from 'see-ajax';
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
const configs = {
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
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('state', {
  url: configs.url.state,
  requestKeys: configs.requestKeys.state,
  preHandle: configs.preHandle.state,
  responseRefactor: configs.responseRefactor.state,
  postHandle: configs.postHandle.state,
});

seeAjax.config('list', {
  url: configs.url.list,
  requestKeys: configs.requestKeys.list,
  preHandle: configs.preHandle.list,
  responseRefactor: configs.responseRefactor.list,
  postHandle: configs.postHandle.list,
});

seeAjax.config('download', {
  url: configs.url.download,
  requestKeys: configs.requestKeys.download,
  preHandle: configs.preHandle.download,
  responseRefactor: configs.responseRefactor.download,
  postHandle: configs.postHandle.download,
});
