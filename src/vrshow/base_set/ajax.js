import $ from "jquery";
import "lib/jquery.seeAjax";
var requestKeysOuter = {
  getList: {},
  getTempleSet: {},
  updateTempleSet: {
    giftList: "giftList",
    freeNumber: "freeNumber",
    musicId: "musicId"
  }
};
var responseRefactorOuter = {
  getList: {},
  getTempleSet: {
    giftList: "giftList",
    freeNumber: "freeNumber",
    musicList: "musicList",
    url: "url"
  },
  updateTempleSet: {}
};
var preHandleOuter = {
  getList: function (data) {}
};
var postHandleOuter = {
  common: function (res) {
    res.success = res.result >= 0;
    typeof res.msg != "undefined" && (res.message = res.msg);
  },
  getList: function (res) {}
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    getList: "getList",
    getTempleSet: "getTempleSet",
    updateTempleSet: "updateTempleSet"
  },
  url: {
    getList: [],
    getTempleSet: ["/zzhadmin/vr_templeSetting/", "/src/vrshow/base_set/mock/get_temple_set_server.json", "/src/vrshow/base_set/mock/get_temple_set.json"],
    updateTempleSet: ["/zzhadmin/vr_saveTempleSetting/"]
  },
  requestKeys: {
    getList: [requestKeysOuter.getList, requestKeysOuter.getList],
    getTempleSet: [requestKeysOuter.getTempleSet, requestKeysOuter.getTempleSet],
    updateTempleSet: [requestKeysOuter.updateTempleSet, requestKeysOuter.updateTempleSet]
  },
  responseRefactor: {
    getList: [responseRefactorOuter.getList, responseRefactorOuter.getList]
  },
  preHandle: {
    getList: [preHandleOuter.getList, preHandleOuter.getList]
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    getList: [postHandleOuter.getList, postHandleOuter.getList]
  }
});
