/**
 * Created by kang on 2017/11/8.
 */

define(['jquery', './data', 'lib/jquery.seeAjax'], function($, Data) {
  var requestKeysOuter = {
    // 左侧本地，右侧服务器
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
  var responseRefactorOuter = {
    // 左侧本地数据名称，右侧服务器名称
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
  var preHandleOuter = {
    getList: function(data) {},
  };
  var postHandleOuter = {
    common: function(res) {
      // success field
      res.success = res.result >= 0;
      // message field
      typeof res.msg != 'undefined' && (res.message = res.msg);
    },
    getList: function(res) {
      // 添加排名字段
      res.data.map(function(item, index) {
        item.rank =
          index + 1 + Data.getListParams.page * Data.getListParams.pageSize;
      });
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      getList: 'getList', // 获取列表
      getTag: 'getTag', // 获取标签
      updateTag: 'updateTag', // 更新分组 添加 修改
      delTag: 'delTag', // 删除分组
      addMeritToGroup: 'addMeritToGroup', // 将功德主添加分组
      delMeritFromGroup: 'delMeritFromGroup', // 将功德主从分组移除
    },
    //url请求地址
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
    // 请求参数
    requestKeys: {
      getList: [requestKeysOuter.getList, requestKeysOuter.getList],
      getTag: [requestKeysOuter.getTag, requestKeysOuter.getTag],
      updateTag: [requestKeysOuter.updateTag, requestKeysOuter.updateTag],
      delTag: [requestKeysOuter.delTag, requestKeysOuter.delTag],
      addMeritToGroup: [
        requestKeysOuter.addMeritToGroup,
        requestKeysOuter.addMeritToGroup,
      ],
      delMeritFromGroup: [
        requestKeysOuter.delMeritFromGroup,
        requestKeysOuter.delMeritFromGroup,
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      getList: [responseRefactorOuter.getList, responseRefactorOuter.getList],
      getTag: [responseRefactorOuter.getTag, responseRefactorOuter.getTag],
    },
    //ajax请求前置处理
    preHandle: {
      getList: [preHandleOuter.getList, preHandleOuter.getList],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      getList: [postHandleOuter.getList, postHandleOuter.getList],
    },
  });
});
