import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeysOuter = {
  list: {
    page: 'pageNumber',
    startDate: 'startTime',
    endDate: 'endTime',
  },
};
var responseRefactorOuter = {
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
var preHandleOuter = {
  list: function(data) {
    data.pageNumber -= 1;
    data.pageSize = 20;
  },
};
var postHandleOuter = {
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
    list: 'list',
  },
  url: {
    list: [
      '/zzhadmin/getArticleSuixiList/',
      '/src/article/interact/mock/list_server.json',
      '/src/article/interact/mock/list.json',
    ],
  },
  requestKeys: {
    list: [
      requestKeysOuter.list,
      requestKeysOuter.list,
      {
        page: 'page',
        startDate: 'startDate',
        endDate: 'endDate',
      },
    ],
    download: [
      requestKeysOuter.download,
      requestKeysOuter.download,
      {
        startDate: 'startDate',
        endDate: 'endDate',
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
