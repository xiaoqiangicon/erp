import $ from "jquery";
import "lib/jquery.seeAjax";
var requestKeysOuter = {
  getScene: {
    type: "type"
  },
  getSceneSet: {
    sceneId: "sceneId"
  },
  updateSet: {
    sceneId: "sceneId",
    summary: "introduce",
    sound: "introduceVoice",
    pic: "introducePic"
  }
};
var responseRefactorOuter = {
  getScene: {
    data: [{
      sceneId: "id",
      sceneName: "name",
      summary: "introduce",
      sound: "introduceVoice",
      pic: "introducePic"
    }]
  },
  getSceneSet: {
    data: {
      sceneId: "id",
      sceneName: "name",
      summary: "introduce",
      sound: "introduceVoice",
      pic: "introducePic"
    }
  }
};
var preHandleOuter = {};
var postHandleOuter = {
  common: function (res) {
    res.success = res.result >= 0;
    typeof res.msg !== "undefined" && (res.message = res.msg);
  }
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    getScene: "getScene",
    getSceneSet: "getSceneSet",
    updateSet: "updateSet"
  },
  url: {
    getScene: ["/zzhadmin/vr_sceneList/", "/src/vrshow/create_summary/mock/get_set_server.json", "/src/vrshow/create_summary/mock/get_set.json"],
    getSceneSet: ["/zzhadmin/vr_sceneGet/"],
    updateSet: ["/zzhadmin/vr_sceneEdit/", "/src/vrshow/success.json", "/src/vrshow/success.json"]
  },
  requestKeys: {
    getScene: [requestKeysOuter.getScene, requestKeysOuter.getScene],
    getSceneSet: [requestKeysOuter.getSceneSet, requestKeysOuter.getSceneSet],
    updateSet: [requestKeysOuter.updateSet, requestKeysOuter.updateSet]
  },
  responseRefactor: {
    getScene: [responseRefactorOuter.getScene, responseRefactorOuter.getScene],
    getSceneSet: [responseRefactorOuter.getSceneSet, responseRefactorOuter.getSceneSet]
  },
  preHandle: {},
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common]
  }
});
