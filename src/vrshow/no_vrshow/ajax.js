import $ from 'jquery';
import seeAjax from 'see-ajax';
var requestKeys = {
  getList: {},
};
var responseRefactor = {
  getList: {},
};
var preHandle = {
  getList: function(data) {},
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
  },
  getList: function(res) {},
};
const configs = {
  url: {
    getList: [],
  },
  requestKeys: {
    getList: [requestKeys.getList, requestKeys.getList],
  },
  responseRefactor: {
    getList: [responseRefactor.getList, responseRefactor.getList],
  },
  preHandle: {
    getList: [preHandle.getList, preHandle.getList],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    getList: [postHandle.getList, postHandle.getList],
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
