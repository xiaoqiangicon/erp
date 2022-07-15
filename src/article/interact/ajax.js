import $ from 'jquery';
import seeAjax from 'see-ajax';
import handleAjaxError from '../../com/handle-ajax-error';
import cookie from 'js-cookie';

let isStaff = cookie.get('is_staff') === 'False';
var requestKeys = {
  list: {
    page: 'pageNumber',
    startDate: 'startTime',
    endDate: 'endTime',
  },
};
var responseRefactor = {
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

    handleAjaxError(res);
  },
  list: function(res) {
    res.totalPages = Math.ceil((res.total || 1) / 20);
    res.data.forEach(item => {
      item.isStaff = isStaff;
    });
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: [postHandle.common, postHandle.common],
});

seeAjax.config('list', {
  url: [
    '/zzhadmin/getArticleSuixiList/',
    '/src/article/interact/mock/list_server.json',
    '/src/article/interact/mock/list.json',
  ],
  requestKeys: [requestKeys.list, requestKeys.list],
  responseRefactor: [responseRefactor.list, responseRefactor.list],
  preHandle: [preHandle.list, preHandle.list],
  postHandle: [postHandle.list, postHandle.list],
});
