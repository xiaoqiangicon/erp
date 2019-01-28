/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    list: {
      page: 'pageNumber',
      startDate: 'startTime',
      endDate: 'endTime',
    },
  };
  var responseRefactorOuter = {
    list: {
      data: [
        {
          nickname: 'nickName',
          avatar: 'headImg',
          amount: 'price',
          time: 'addTime',
        },
      ],
    },
  };
  var preHandleOuter = {
    list: function(data) {
      data.pageNumber -= 1;
      data.pageSize = 20;
    },
  };
  var postHandleOuter = {
    common: function(res) {
      // success field
      res.success = res.result >= 0;
      // message field
      typeof res.msg != 'undefined' && (res.message = res.msg);
    },
    list: function(res) {
      res.nextPage = res.pageNumber + 1;
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 获取捐赠列表
      list: 'list',
    },
    //url请求地址
    url: {
      list: [
        '/zzhadmin/getArticleSuixiList/',
        '/src/article/interact/mock/list_server.json',
        '/src/article/interact/mock/list.json',
      ],
    },
    // 请求参数
    requestKeys: {
      list: [
        requestKeysOuter.list,
        requestKeysOuter.list,
        {
          page: 'page',
          startDate: 'startDate',
          endDate: 'endDate',
        },
      ],
      download: [
        requestKeysOuter.download,
        requestKeysOuter.download,
        {
          startDate: 'startDate',
          endDate: 'endDate',
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
