import $ from 'jquery';
import 'lib/jquery.seeAjax';
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
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    getScene: 'getScene',
    getSceneSet: 'getSceneSet',
    updateSet: 'updateSet',
  },
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
});
