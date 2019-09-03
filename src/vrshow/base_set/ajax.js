import $ from 'jquery';
import seeAjax from 'see-ajax';
var requestKeys = {
  getList: {},
  getTempleSet: {},
  updateTempleSet: {
    giftList: 'giftList',
    freeNumber: 'freeNumber',
    musicId: 'musicId',
  },
};
var responseRefactor = {
  getList: {},
  getTempleSet: {
    giftList: 'giftList',
    freeNumber: 'freeNumber',
    musicList: 'musicList',
    url: 'url',
  },
  updateTempleSet: {},
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
    getTempleSet: [
      '/zzhadmin/vr_templeSetting/',
      '/src/vrshow/base_set/mock/get_temple_set_server.json',
      '/src/vrshow/base_set/mock/get_temple_set.json',
    ],
    updateTempleSet: ['/zzhadmin/vr_saveTempleSetting/'],
  },
  requestKeys: {
    getList: [requestKeys.getList, requestKeys.getList],
    getTempleSet: [requestKeys.getTempleSet, requestKeys.getTempleSet],
    updateTempleSet: [requestKeys.updateTempleSet, requestKeys.updateTempleSet],
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

seeAjax.config('getTempleSet', {
  url: configs.url.getTempleSet,
  requestKeys: configs.requestKeys.getTempleSet,
  preHandle: configs.preHandle.getTempleSet,
  responseRefactor: configs.responseRefactor.getTempleSet,
  postHandle: configs.postHandle.getTempleSet,
});

seeAjax.config('updateTempleSet', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.updateTempleSet,
  requestKeys: configs.requestKeys.updateTempleSet,
  preHandle: configs.preHandle.updateTempleSet,
  responseRefactor: configs.responseRefactor.updateTempleSet,
  postHandle: configs.postHandle.updateTempleSet,
});
