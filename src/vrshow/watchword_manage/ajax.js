import $ from 'jquery';
import seeAjax from 'see-ajax';
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
const configs = {
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

seeAjax.config('updateWatchword', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.updateWatchword,
  requestKeys: configs.requestKeys.updateWatchword,
  preHandle: configs.preHandle.updateWatchword,
  responseRefactor: configs.responseRefactor.updateWatchword,
  postHandle: configs.postHandle.updateWatchword,
});

seeAjax.config('operateWatchword', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.operateWatchword,
  requestKeys: configs.requestKeys.operateWatchword,
  preHandle: configs.preHandle.operateWatchword,
  responseRefactor: configs.responseRefactor.operateWatchword,
  postHandle: configs.postHandle.operateWatchword,
});
