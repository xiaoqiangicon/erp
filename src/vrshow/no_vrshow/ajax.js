/**
 * Created by kang on 2017/10/23.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    // 上传字段的映射，左侧本地，右侧服务器
    getList: {},
  };
  var responseRefactorOuter = {
    // 返回字段的映射，左侧本地数据名称，右侧服务器名称
    getList: {},
  };
  var preHandleOuter = {
    // ajax请求前置处理
    getList: function(data) {},
  };
  var postHandleOuter = {
    // ajax请求后置处理
    common: function(res) {
      // success field
      res.success = res.result >= 0;
      // message field
      typeof res.msg != 'undefined' && (res.message = res.msg);
    },
    getList: function(res) {},
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      getList: 'getList', // 示例
    },
    //url请求地址
    url: {
      getList: [],
    },
    // 修改请求参数的映射
    requestKeys: {
      getList: [requestKeysOuter.getList, requestKeysOuter.getList],
    },
    // 修改返回参数的映射
    responseRefactor: {
      getList: [responseRefactorOuter.getList, responseRefactorOuter.getList],
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
