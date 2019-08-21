import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeys = {
  getSceneList: {
    type: 'type',
  },
  deleteScene: {
    sceneId: 'sceneId',
  },
  getLinkList: {},
  updateLink: {
    id: 'id',
    sceneId: 'sceneId',
    title: 'title',
    url: 'url',
  },
  deleteLink: {
    id: 'id',
    status: 'status',
  },
};
var responseRefactor = {
  getSceneList: {
    data: [
      {
        sceneId: 'id',
        sceneName: 'name',
        summary: 'introduce',
        sound: 'introduceVoice',
      },
    ],
  },
  getLinkList: {
    data: [
      {
        id: 'id',
        title: 'title',
        sceneId: 'sceneId',
        sceneName: 'sceneName',
        url: 'url',
      },
    ],
  },
};
var preHandle = {
  getSceneList: function(data) {},
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
  },
  getSceneList: function(res) {},
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    getSceneList: 'getSceneList',
    deleteScene: 'deleteScene',
    getLinkList: 'getLinkList',
    updateLink: 'updateLink',
    deleteLink: 'deleteLink',
  },
  url: {
    getSceneList: [
      '/zzhadmin/vr_sceneList/',
      '/src/vrshow/scene_manage/mock/get_list_server.json',
      '/src/vrshow/scene_manage/mock/get_list.json',
    ],
    deleteScene: [
      '/zzhadmin/vr_sceneIntroduceDel/',
      '/src/vrshow/scene_manage/mock/success.json',
      '/src/vrshow/scene_manage/mock/success.json',
    ],
    getLinkList: [
      '/zzhadmin/vr_activityList/',
      '/src/vrshow/scene_manage/mock/get_link_list_server.json',
      '/src/vrshow/scene_manage/mock/get_link_list.json',
    ],
    updateLink: [
      '/zzhadmin/vr_activityEdit/',
      '/src/vrshow/scene_manage/mock/success.json',
      '/src/vrshow/scene_manage/mock/success.json',
    ],
    deleteLink: [
      '/zzhadmin/vr_activityDel/',
      '/src/vrshow/scene_manage/mock/success.json',
      '/src/vrshow/scene_manage/mock/success.json',
    ],
  },
  requestKeys: {
    getSceneList: [requestKeys.getSceneList, requestKeys.getSceneList],
    deleteScene: [requestKeys.deleteScene, requestKeys.deleteScene],
    getLinkList: [requestKeys.getLinkList, requestKeys.getLinkList],
    updateLink: [requestKeys.updateLink, requestKeys.updateLink],
    deleteLink: [requestKeys.deleteLink, requestKeys.deleteLink],
  },
  responseRefactor: {
    getSceneList: [
      responseRefactor.getSceneList,
      responseRefactor.getSceneList,
    ],
    getLinkList: [responseRefactor.getLinkList, responseRefactor.getLinkList],
  },
  preHandle: {
    getSceneList: [preHandle.getSceneList, preHandle.getSceneList],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    getSceneList: [postHandle.getSceneList, postHandle.getSceneList],
  },
});
