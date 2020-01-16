import $ from 'jquery';
import seeAjax from 'see-ajax';
var requestKeys = {
  getScene: {
    type: 'type',
  },
  getSceneSet: {
    sceneId: 'sceneId',
  },
  updateSet: {
    sceneId: 'sceneId',
    summary: 'introduce',
    sound: 'introduceVoice',
    pic: 'introducePic',
  },
};
var responseRefactor = {
  getScene: {
    data: [
      {
        sceneId: 'id',
        sceneName: 'name',
        summary: 'introduce',
        sound: 'introduceVoice',
        pic: 'introducePic',
      },
    ],
  },
  getSceneSet: {
    data: {
      sceneId: 'id',
      sceneName: 'name',
      summary: 'introduce',
      sound: 'introduceVoice',
      pic: 'introducePic',
    },
  },
};
var preHandle = {};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg !== 'undefined' && (res.message = res.msg);
  },
};
const configs = {
  url: {
    getScene: [
      '/zzhadmin/vr_sceneList/',
      '/src/vrshow/create_summary/mock/get_set_server.json',
      '/src/vrshow/create_summary/mock/get_set.json',
    ],
    getSceneSet: ['/zzhadmin/vr_sceneGet/'],
    updateSet: [
      '/zzhadmin/vr_sceneEdit/',
      '/src/vrshow/success.json',
      '/src/vrshow/success.json',
    ],
  },
  requestKeys: {
    getScene: [requestKeys.getScene, requestKeys.getScene],
    getSceneSet: [requestKeys.getSceneSet, requestKeys.getSceneSet],
    updateSet: [requestKeys.updateSet, requestKeys.updateSet],
  },
  responseRefactor: {
    getScene: [responseRefactor.getScene, responseRefactor.getScene],
    getSceneSet: [responseRefactor.getSceneSet, responseRefactor.getSceneSet],
  },
  preHandle: {},
  postHandle: {
    common: [postHandle.common, postHandle.common],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('getScene', {
  url: configs.url.getScene,
  requestKeys: configs.requestKeys.getScene,
  preHandle: configs.preHandle.getScene,
  responseRefactor: configs.responseRefactor.getScene,
  postHandle: configs.postHandle.getScene,
});

seeAjax.config('getSceneSet', {
  url: configs.url.getSceneSet,
  requestKeys: configs.requestKeys.getSceneSet,
  preHandle: configs.preHandle.getSceneSet,
  responseRefactor: configs.responseRefactor.getSceneSet,
  postHandle: configs.postHandle.getSceneSet,
});

seeAjax.config('updateSet', {
  method: ['post'],
  url: configs.url.updateSet,
  requestKeys: configs.requestKeys.updateSet,
  preHandle: configs.preHandle.updateSet,
  responseRefactor: configs.responseRefactor.updateSet,
  postHandle: configs.postHandle.updateSet,
});
