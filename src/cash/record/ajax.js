import $ from 'jquery';
import seeAjax from 'see-ajax';
import handleAjaxError from '../../com/handle-ajax-error';
var listPerPage = 20;
var currentRequestKey = '';
var totalPages = {};
var listTotalPages = 0;
var payTypes = {
  1: '皈依',
  2: '项目',
  3: '直播',
  4: '供佛墙',
  5: '文章',
  6: '高僧供养',
  7: '功德箱',
  8: '实境礼佛',
  9: '掌中佛殿',
  10: '个人佛殿',
  11: '日行一善',
};
var requestKeys = {
  list: {
    startDate: 'startTime',
    endDate: 'endTime',
    page: 'pageNumber',
  },
};
var responseRefactor = {
  list: {
    data: [
      {
        nickname: 'nick_name',
        money: 'price',
        orderId: 'order_id',
        time: 'add_time',
        category: 'detail',
      },
    ],
  },
};
var preHandle = {
  list: function(data) {
    data.pageNumber -= 1;
    data.pageSize = listPerPage;
    currentRequestKey = data.startTime + '-' + data.endTime;
  },
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    !!res.msg && (res.message = res.msg);

    handleAjaxError(res);
  },
  list: function(res) {
    listTotalPages = totalPages[currentRequestKey];
    if (res.cnt <= 0 && listTotalPages <= 0) {
      res.currentPage = 1;
      res.totalPages = 1;
      totalPages[currentRequestKey] = 1;
    } else if (res.cnt > 0) {
      res.totalPages = Math.ceil(res.cnt / listPerPage);
      totalPages[currentRequestKey] = res.totalPages;
      res.pageNumber < 0
        ? (res.currentPage = listTotalPages)
        : (res.currentPage = res.pageNumber + 1);
    } else {
      res.totalPages = listTotalPages;
      res.pageNumber < 0
        ? (res.currentPage = listTotalPages)
        : (res.currentPage = res.pageNumber + 1);
    }
    res.data.map(function(item) {
      item.typeInt = item.type;
      item.type = payTypes[item.typeInt];
      item.time = item.time.slice(0, 16);
    });
  },
};
const configs = {
  url: {
    list: [
      '/zzhadmin/getTransactionRecordList/',
      '/src/cash/record/mock/list_server.json',
      '/src/cash/record/mock/list.json',
    ],
  },
  requestKeys: {
    list: [
      requestKeys.list,
      requestKeys.list,
      {
        startDate: 'startDate',
        endDate: 'endDate',
        page: 'page',
      },
    ],
  },
  responseRefactor: {
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

seeAjax.config('list', {
  url: configs.url.list,
  requestKeys: configs.requestKeys.list,
  preHandle: configs.preHandle.list,
  responseRefactor: configs.responseRefactor.list,
  postHandle: configs.postHandle.list,
});
