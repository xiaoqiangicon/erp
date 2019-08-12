import $ from "jquery";
import Data from "./data";
import "lib/jquery.seeAjax";
var requestKeysOuter = {
  getList: {
    page: "pageNum",
    pageSize: "pageSize",
    type: "type",
    searchText: "searchText",
    number: "number",
    tagId: "groupId"
  },
  getTag: {},
  updateTag: {
    tagId: "groupId",
    tagName: "groupName"
  },
  delTag: {
    tagId: "groupId"
  },
  addMeritToGroup: {
    tagIds: "groupId",
    userIds: "userIds"
  },
  delMeritFromGroup: {
    tagId: "groupId",
    userIds: "userIds"
  }
};
var responseRefactorOuter = {
  getList: {
    data: [{
      name: "name",
      money: "money",
      pic: "pic",
      payTimes: "payTimes",
      id: "id",
      userId: "userId",
      rank: "rank"
    }],
    total: "total"
  },
  getTag: {
    data: [{
      id: "id",
      name: "name",
      num: "members"
    }]
  },
  updateTag: {},
  delTag: {}
};
var preHandleOuter = {
  getList: function (data) {}
};
var postHandleOuter = {
  common: function (res) {
    res.success = res.result >= 0;
    typeof res.msg != "undefined" && (res.message = res.msg);
  },
  getList: function (res) {
    res.data.map(function (item, index) {
      item.rank = index + 1 + Data.getListParams.page * Data.getListParams.pageSize;
    });
  }
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    getList: "getList",
    getTag: "getTag",
    updateTag: "updateTag",
    delTag: "delTag",
    addMeritToGroup: "addMeritToGroup",
    delMeritFromGroup: "delMeritFromGroup"
  },
  url: {
    getList: ["/zzhadmin/getMeritRank/", "/src/merit/manage/mock/merit_list_server.json", "/src/merit/manage/mock/merit_list.json"],
    getTag: ["/zzhadmin/getMeritUserGroupList/"],
    updateTag: ["/zzhadmin/editMeritGroup/"],
    delTag: ["/zzhadmin/delMeritGroup/"],
    addMeritToGroup: ["/zzhadmin/addMeritToGroup/"],
    delMeritFromGroup: ["/zzhadmin/delMeritFromGroup/"]
  },
  requestKeys: {
    getList: [requestKeysOuter.getList, requestKeysOuter.getList],
    getTag: [requestKeysOuter.getTag, requestKeysOuter.getTag],
    updateTag: [requestKeysOuter.updateTag, requestKeysOuter.updateTag],
    delTag: [requestKeysOuter.delTag, requestKeysOuter.delTag],
    addMeritToGroup: [requestKeysOuter.addMeritToGroup, requestKeysOuter.addMeritToGroup],
    delMeritFromGroup: [requestKeysOuter.delMeritFromGroup, requestKeysOuter.delMeritFromGroup]
  },
  responseRefactor: {
    getList: [responseRefactorOuter.getList, responseRefactorOuter.getList],
    getTag: [responseRefactorOuter.getTag, responseRefactorOuter.getTag]
  },
  preHandle: {
    getList: [preHandleOuter.getList, preHandleOuter.getList]
  },
  postHandle: {
    common: [postHandleOuter.common, postHandleOuter.common],
    getList: [postHandleOuter.getList, postHandleOuter.getList]
  }
});
