import $ from 'jquery';
import seeAjax from 'see-ajax';
var requestKeys = {};
var responseRefactor = {};
var preHandle = {};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    res.msg && (res.message = res.msg);
  },
};
const configs = {
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
