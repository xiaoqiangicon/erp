import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeys = {
  getList: {
    pageNum: 'pageNum',
    pageSize: 'pageSize',
  },
  updateWatchword: {
    id: 'id',
    name: 'name',
    content: 'content',
  },
  operateWatchword: {
    id: 'id',
    status: 'status',
  },
};
var responseRefactor = {
  getList: {
    data: [
      {
        pic: 'pic',
      },
    ],
  },
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
    updateWatchword: 'updateWatchword',
    operateWatchword: 'operateWatchword',
  },
  url: {
    getList: [
      '/zzhadmin/vr_speakerContentList/',
      '/src/vrshow/watchword_manage/mock/get_watchword_list_server.json',
      '/src/vrshow/watchword_manage/mock/get_watchword_list.json',
    ],
    updateWatchword: [
      '/zzhadmin/vr_editSpeaker/',
      '/src/vrshow/watchword_manage/mock/update_watchword_server.json',
      '/src/vrshow/watchword_manage/mock/update_watchword.json',
    ],
    operateWatchword: [
      '/zzhadmin/vr_editSpeakerStatus/',
      '/src/vrshow/watchword_manage/mock/update_watchword_server.json',
      '/src/vrshow/watchword_manage/mock/update_watchword.json',
    ],
  },
  requestKeys: {
    getList: [requestKeys.getList, requestKeys.getList],
    updateWatchword: [requestKeys.updateWatchword, requestKeys.updateWatchword],
    operateWatchword: [
      requestKeys.operateWatchword,
      requestKeys.operateWatchword,
    ],
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
