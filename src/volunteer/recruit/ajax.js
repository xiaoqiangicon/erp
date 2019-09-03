import $ from 'jquery';
import seeAjax from 'see-ajax';
var requestKeys = {
  list: {
    page: 'pageNumber',
    pageSize: 'pageSize',
  },
};
var responseRefactor = {
  list: {
    data: [
      {
        id: 'activityId',
        title: 'activityName',
        cover: 'pic',
        recruitCount: 'joinNum',
        recordCount: 'inputNum',
        signInCount: 'signNum',
        totalPage: 'total',
        nextPageNum: 'pageNumber',
      },
    ],
  },
};
var preHandle = {
  list: function(data) {
    data.pageNumber -= 1;
    data.pageSize = 25;
  },
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
  },
};
const configs = {
  environment: __SEE_ENV__,
  name: {
    list: 'list',
  },
  url: {
    list: [
      '/zzhadmin/getActivityList/',
      '/src/volunteer/recruit/mock/index_list_server.json',
      '/src/volunteer/recruit/mock/index_list.json',
    ],
  },
  requestKeys: {
    list: [
      requestKeys.list,
      requestKeys.list,
      {
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
