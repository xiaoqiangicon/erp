import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeysOuter = {
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
var responseRefactorOuter = {
  getList: {
    data: [
      {
        pic: 'pic',
      },
    ],
  },
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
    getList: [requestKeysOuter.getList, requestKeysOuter.getList],
    updateWatchword: [
      requestKeysOuter.updateWatchword,
      requestKeysOuter.updateWatchword,
    ],
    operateWatchword: [
      requestKeysOuter.operateWatchword,
      requestKeysOuter.operateWatchword,
    ],
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
