import $ from 'jquery';
import Data from './data';
import seeAjax from 'see-ajax';
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
const configs = {
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
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('getList', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.getList,
  requestKeys: configs.requestKeys.getList,
  preHandle: configs.preHandle.getList,
  responseRefactor: configs.responseRefactor.getList,
  postHandle: configs.postHandle.getList,
});

seeAjax.config('getTag', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.getTag,
  requestKeys: configs.requestKeys.getTag,
  preHandle: configs.preHandle.getTag,
  responseRefactor: configs.responseRefactor.getTag,
  postHandle: configs.postHandle.getTag,
});

seeAjax.config('updateTag', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.updateTag,
  requestKeys: configs.requestKeys.updateTag,
  preHandle: configs.preHandle.updateTag,
  responseRefactor: configs.responseRefactor.updateTag,
  postHandle: configs.postHandle.updateTag,
});

seeAjax.config('delTag', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.delTag,
  requestKeys: configs.requestKeys.delTag,
  preHandle: configs.preHandle.delTag,
  responseRefactor: configs.responseRefactor.delTag,
  postHandle: configs.postHandle.delTag,
});

seeAjax.config('addMeritToGroup', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.addMeritToGroup,
  requestKeys: configs.requestKeys.addMeritToGroup,
  preHandle: configs.preHandle.addMeritToGroup,
  responseRefactor: configs.responseRefactor.addMeritToGroup,
  postHandle: configs.postHandle.addMeritToGroup,
});

seeAjax.config('delMeritFromGroup', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.delMeritFromGroup,
  requestKeys: configs.requestKeys.delMeritFromGroup,
  preHandle: configs.preHandle.delMeritFromGroup,
  responseRefactor: configs.responseRefactor.delMeritFromGroup,
  postHandle: configs.postHandle.delMeritFromGroup,
});
