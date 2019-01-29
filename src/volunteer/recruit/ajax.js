/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    // 左侧本地，右侧服务器
    list: {
      page: 'pageNumber',
      pageSize: 'pageSize',
    },
  };
  var responseRefactorOuter = {
    // 左侧本地数据名称，右侧服务器名称
    list: {
      data: [
        {
          id: 'activityId',
          title: 'activityName',
          cover: 'pic',
          recruitCount: 'joinNum',
          recordCount: 'inputNum',
          signInCount: 'signNum',
          totalPage: 'total',
          nextPageNum: 'pageNumber',
        },
      ],
    },
  };
  var preHandleOuter = {
    list: function(data) {
      data.pageNumber -= 1;
      data.pageSize = 25;
    },
  };
  var postHandleOuter = {
    common: function(res) {
      // success field
      res.success = res.result >= 0;
      // message field
      typeof res.msg != 'undefined' && (res.message = res.msg);
    },
  };

  $.seeAjax.config({
    environment: 0, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 获取义工活动列表
      list: 'list',
    },
    //url请求地址
    url: {
      list: [
        '/zzhadmin/getActivityList/',
        '/static/data/volunteer/recruit/index_list_server.json',
        '/static/data/volunteer/recruit/index_list.json',
      ],
    },
    // 请求参数
    requestKeys: {
      list: [
        requestKeysOuter.list,
        requestKeysOuter.list,
        {
          page: 'page',
        },
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      list: [responseRefactorOuter.list, responseRefactorOuter.list],
    },
    //ajax请求前置处理
    preHandle: {
      list: [preHandleOuter.list, preHandleOuter.list],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      list: [postHandleOuter.list, postHandleOuter.list],
    },
  });
});
