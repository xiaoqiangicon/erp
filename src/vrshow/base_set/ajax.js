import $ from 'jquery';
import 'lib/jquery.seeAjax';
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
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    getList: 'getList',
    getTempleSet: 'getTempleSet',
    updateTempleSet: 'updateTempleSet',
  },
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
});
