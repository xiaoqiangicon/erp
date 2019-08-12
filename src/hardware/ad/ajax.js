import $ from "jquery";
import commonVars from "common/variables";
import data from "./data";
import "lib/jquery.seeAjax";
var typeTexts = ["自在家", "自定义", "佛事", "文章"];
var requestKeysOuter = {
  switch: {
    id: "adId",
    hide: "status"
  }
};
var responseRefactorOuter = {
  detail: {
    data: [{
      image: "picUrl",
      hide: "status",
      link: "linkUrl"
    }]
  }
};
var preHandleOuter = {
  detail: function (req) {
    req.machineId = parseInt(commonVars.params.id);
  }
};
var postHandleOuter = {
  common: function (res) {
    res.success = res.result >= 0;
    res.msg && (res.message = res.msg);
  },
  detail: function (res) {
    res.data && res.data.length && res.data.map(function (item) {
      item.typeText = typeTexts[item.type];
    });
  }
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    detail: "detail",
    switch: "switch"
  },
  url: {
    detail: ["/zzhadmin/merit_machine_ad_list/", "/src/hardware/ad/mock/detail_server.json", "/src/hardware/ad/mock/detail.json"],
    switch: ["/zzhadmin/merit_machine_ad_status/", "/src/hardware/ad/mock/switch_server.json", "/src/hardware/ad/mock/switch.json"]
  },
  requestKeys: {
    switch: [requestKeysOuter.switch, requestKeysOuter.switch, {
      id: "id",
      hide: "hide"
    }]
  },
  responseRefactor: {
    detail: [responseRefactorOuter.detail, responseRefactorOuter.detail]
  },
  preHandle: {
    detail: [preHandleOuter.detail, preHandleOuter.detail]
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    detail: [postHandleOuter.detail, postHandleOuter.detail]
  }
});
