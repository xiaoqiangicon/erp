import $ from 'jquery';
import Data from './data';
import 'lib/jquery.seeAjax';
var requestKeys = {
  getList: {
    page: 'pageNum',
    pageSize: 'pageSize',
    type: 'type',
    searchText: 'searchText',
    number: 'number',
    tagId: 'groupId',
  },
  getTag: {},
  updateTag: {
    tagId: 'groupId',
    tagName: 'groupName',
  },
  delTag: {
    tagId: 'groupId',
  },
  addMeritToGroup: {
    tagIds: 'groupId',
    userIds: 'userIds',
  },
  delMeritFromGroup: {
    tagId: 'groupId',
    userIds: 'userIds',
  },
};
var responseRefactor = {
  getList: {
    data: [
      {
        name: 'name',
        money: 'money',
        pic: 'pic',
        payTimes: 'payTimes',
        id: 'id',
        userId: 'userId',
        rank: 'rank',
      },
    ],
    total: 'total',
  },
  getTag: {
    data: [
      {
        id: 'id',
        name: 'name',
        num: 'members',
      },
    ],
  },
  updateTag: {},
  delTag: {},
};
var preHandle = {
  getList: function(data) {},
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
  },
  getList: function(res) {
    res.data.map(function(item, index) {
      item.rank =
        index + 1 + Data.getListParams.page * Data.getListParams.pageSize;
    });
  },
};
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    getList: 'getList',
    getTag: 'getTag',
    updateTag: 'updateTag',
    delTag: 'delTag',
    addMeritToGroup: 'addMeritToGroup',
    delMeritFromGroup: 'delMeritFromGroup',
  },
  url: {
    getList: [
      '/zzhadmin/getMeritRank/',
      '/src/merit/manage/mock/merit_list_server.json',
      '/src/merit/manage/mock/merit_list.json',
    ],
    getTag: ['/zzhadmin/getMeritUserGroupList/'],
    updateTag: ['/zzhadmin/editMeritGroup/'],
    delTag: ['/zzhadmin/delMeritGroup/'],
    addMeritToGroup: ['/zzhadmin/addMeritToGroup/'],
    delMeritFromGroup: ['/zzhadmin/delMeritFromGroup/'],
  },
  requestKeys: {
    getList: [requestKeys.getList, requestKeys.getList],
    getTag: [requestKeys.getTag, requestKeys.getTag],
    updateTag: [requestKeys.updateTag, requestKeys.updateTag],
    delTag: [requestKeys.delTag, requestKeys.delTag],
    addMeritToGroup: [requestKeys.addMeritToGroup, requestKeys.addMeritToGroup],
    delMeritFromGroup: [
      requestKeys.delMeritFromGroup,
      requestKeys.delMeritFromGroup,
    ],
  },
  responseRefactor: {
    getList: [responseRefactor.getList, responseRefactor.getList],
    getTag: [responseRefactor.getTag, responseRefactor.getTag],
  },
  preHandle: {
    getList: [preHandle.getList, preHandle.getList],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    getList: [postHandle.getList, postHandle.getList],
  },
});
