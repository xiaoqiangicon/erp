import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeys = {};
var responseRefactor = {};
var preHandle = {};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    res.msg && (res.message = res.msg);
  },
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    list: 'list',
  },
  url: {
    list: [
      '/zzhadmin/merit_machine_list/',
      '/src/hardware/donate/mock/list_server.json',
      '/src/hardware/donate/mock/list.json',
    ],
  },
  requestKeys: {},
  responseRefactor: {},
  preHandle: {},
  postHandle: {
    common: [postHandle.common, postHandle.common],
  },
});
