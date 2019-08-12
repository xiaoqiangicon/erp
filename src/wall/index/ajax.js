import $ from "jquery";
import "lib/jquery.seeAjax";
var requestKeysOuter = {
  delete: {
    id: "id"
  },
  sort: {
    id: "id",
    sort: "sort"
  }
};
var responseRefactorOuter = {
  list: {
    data: [{
      cover: "coverPic",
      sequence: "sort",
      regions: "wallName"
    }]
  },
  promotionUrl: {
    url: "data"
  },
  templates: {
    data: [{
      id: "templateId",
      image: "coverPic",
      category: "type"
    }]
  }
};
var preHandleOuter = {};
var postHandleOuter = {
  common: function (res) {
    res.success = res.result >= 0;
    res.msg && (res.message = res.msg);
  },
  list: function (res) {
    res.data && res.data.length && res.data.map(function (item) {
      item.regions == "暂无设置" && (item.regions = "");
    });
  },
  templates: function (res) {
    res.data && res.data.length && res.data.map(function (item) {
      item.category && (item.category -= 1);
    });
  }
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    list: "list",
    promotionUrl: "promotionUrl",
    templates: "templates",
    delete: "delete",
    sort: "sort"
  },
  url: {
    list: ["/zzhadmin/buddhaWallBuddhaList/", "/src/wall/index/mock/list_server.json", "/src/wall/index/mock/list.json"],
    promotionUrl: ["/zzhadmin/buddhaWall_url/", "/src/wall/index/mock/promotion_url_server.json", "/src/wall/index/mock/promotion_url.json"],
    templates: ["/zzhadmin/buddhaWall_templateList/", "/src/wall/index/mock/templates_server.json", "/src/wall/index/mock/templates.json"],
    delete: ["/zzhadmin/buddhaWall_delBuddha/", "/src/wall/index/mock/delete_server.json", "/src/wall/index/mock/delete.json"],
    sort: ["/zzhadmin/buddhaWall_buddhaSort/", "/src/wall/index/mock/sort_server.json", "/src/wall/index/mock/sort.json"]
  },
  requestKeys: {
    delete: [requestKeysOuter.delete, requestKeysOuter.delete, {
      id: "id"
    }],
    sort: [requestKeysOuter.sort, requestKeysOuter.sort, {
      id: "id",
      sort: "sort"
    }]
  },
  responseRefactor: {
    list: [responseRefactorOuter.list, responseRefactorOuter.list],
    promotionUrl: [responseRefactorOuter.promotionUrl, responseRefactorOuter.promotionUrl],
    templates: [responseRefactorOuter.templates, responseRefactorOuter.templates]
  },
  preHandle: {},
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    list: [postHandleOuter.list, postHandleOuter.list],
    templates: [postHandleOuter.templates, postHandleOuter.templates]
  }
});
