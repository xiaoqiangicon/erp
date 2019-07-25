/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {};
  var responseRefactorOuter = {};
  var preHandleOuter = {};
  var postHandleOuter = {
    common: function(res) {
      res.success = res.result >= 0;
      res.msg && (res.message = res.msg);
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 请求列表
      list: 'list',
    },
    //url请求地址
    url: {
      list: [
        '/zzhadmin/merit_machine_list/',
        '/src/hardware/donate/mock/list_server.json',
        '/src/hardware/donate/mock/list.json',
      ],
    },
    // 请求参数
    requestKeys: {},
    // 重新格式化json数据
    responseRefactor: {},
    //ajax请求前置处理
    preHandle: {},
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
    },
  });
});
