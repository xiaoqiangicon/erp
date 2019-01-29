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
    state: {
      totalDonate: 'priceSum',
      monthDonate: 'priceMonthSum',
      dayDonate: 'priceDaySum',
    },
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
      // 统计信息
      state: 'state',
      // 获取捐赠列表
      list: 'list',
      // 下载表格
      download: 'download',
    },
    //url请求地址
    url: {
      state: [
        '/zzhadmin/meritBoxSumGet/',
        '/src/temple/donate_box/mock/state_server.json',
        '/src/temple/donate_box/mock/state.json',
      ],
      list: [
        '/zzhadmin/meritBoxGetList/',
        '/src/temple/donate_box/mock/list_server.json',
        '/src/temple/donate_box/mock/list.json',
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
    },
    // 重新格式化json数据
    responseRefactor: {
      state: [responseRefactorOuter.state, responseRefactorOuter.state],
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
