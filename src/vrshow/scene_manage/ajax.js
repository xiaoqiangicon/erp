import $ from 'jquery';
import seeAjax from 'see-ajax';
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
const configs = {
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
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('getSceneList', {
  url: configs.url.getSceneList,
  requestKeys: configs.requestKeys.getSceneList,
  preHandle: configs.preHandle.getSceneList,
  responseRefactor: configs.responseRefactor.getSceneList,
  postHandle: configs.postHandle.getSceneList,
});

seeAjax.config('deleteScene', {
  url: configs.url.deleteScene,
  requestKeys: configs.requestKeys.deleteScene,
  preHandle: configs.preHandle.deleteScene,
  responseRefactor: configs.responseRefactor.deleteScene,
  postHandle: configs.postHandle.deleteScene,
});

seeAjax.config('getLinkList', {
  url: configs.url.getLinkList,
  requestKeys: configs.requestKeys.getLinkList,
  preHandle: configs.preHandle.getLinkList,
  responseRefactor: configs.responseRefactor.getLinkList,
  postHandle: configs.postHandle.getLinkList,
});

seeAjax.config('updateLink', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.updateLink,
  requestKeys: configs.requestKeys.updateLink,
  preHandle: configs.preHandle.updateLink,
  responseRefactor: configs.responseRefactor.updateLink,
  postHandle: configs.postHandle.updateLink,
});

seeAjax.config('deleteLink', {
  url: configs.url.deleteLink,
  requestKeys: configs.requestKeys.deleteLink,
  preHandle: configs.preHandle.deleteLink,
  responseRefactor: configs.responseRefactor.deleteLink,
  postHandle: configs.postHandle.deleteLink,
});
