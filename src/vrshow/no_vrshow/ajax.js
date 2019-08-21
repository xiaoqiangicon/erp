import $ from 'jquery';
import 'lib/jquery.seeAjax';
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
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    getList: 'getList',
  },
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
});
