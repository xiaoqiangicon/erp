import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeysOuter = {
  getList: {},
};
var responseRefactorOuter = {
  getList: {},
};
var preHandleOuter = {
  getList: function(data) {},
};
var postHandleOuter = {
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
    getList: [requestKeysOuter.getList, requestKeysOuter.getList],
  },
  responseRefactor: {
    getList: [responseRefactorOuter.getList, responseRefactorOuter.getList],
  },
  preHandle: {
    getList: [preHandleOuter.getList, preHandleOuter.getList],
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    getList: [postHandleOuter.getList, postHandleOuter.getList],
  },
});
