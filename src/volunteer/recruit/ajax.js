import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeysOuter = {
  list: {
    page: 'pageNumber',
    pageSize: 'pageSize',
  },
};
var responseRefactorOuter = {
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
var preHandleOuter = {
  list: function(data) {
    data.pageNumber -= 1;
    data.pageSize = 25;
  },
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
      requestKeysOuter.list,
      requestKeysOuter.list,
      {
        page: 'page',
      },
    ],
  },
  responseRefactor: {
    list: [responseRefactorOuter.list, responseRefactorOuter.list],
  },
  preHandle: {
    list: [preHandleOuter.list, preHandleOuter.list],
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    list: [postHandleOuter.list, postHandleOuter.list],
  },
});
