/**
 * Created by senntyou on 2017/3/29.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var listPerPage = 20; // 列表每页多少条
  var currentRequestKey = '';
  var totalPages = {}; // 用于记录总页数，因为后台只会返回一次
  var listTotalPages = 0;
  var payTypes = {
    // 支付类型
    1: '皈依',
    2: '佛事',
    3: '直播',
    4: '供佛墙',
    5: '文章',
    6: '高僧供养',
    7: '功德箱',
    8: '实境礼佛',
    9: '掌中佛殿',
    10: '个人佛殿',
    11: '日行一善',
  };

  var requestKeysOuter = {
    list: {
      startDate: 'startTime',
      endDate: 'endTime',
      page: 'pageNumber',
    },
  };
  var responseRefactorOuter = {
    list: {
      data: [
        {
          nickname: 'nick_name',
          money: 'price',
          orderId: 'order_id',
          time: 'add_time',
          category: 'detail',
        },
      ],
    },
  };
  var preHandleOuter = {
    list: function(data) {
      data.pageNumber -= 1;
      data.pageSize = listPerPage;

      currentRequestKey = data.startTime + '-' + data.endTime;
    },
  };
  var postHandleOuter = {
    common: function(res) {
      res.success = res.result >= 0;
      !!res.msg && (res.message = res.msg);
    },
    list: function(res) {
      listTotalPages = totalPages[currentRequestKey];
      if (res.cnt <= 0 && listTotalPages <= 0) {
        res.currentPage = 1;
        res.totalPages = 1;
        totalPages[currentRequestKey] = 1;
      } else if (res.cnt > 0) {
        res.totalPages = Math.ceil(res.cnt / listPerPage);
        totalPages[currentRequestKey] = res.totalPages;
        res.pageNumber < 0
          ? (res.currentPage = listTotalPages)
          : (res.currentPage = res.pageNumber + 1);
      } else {
        res.totalPages = listTotalPages;
        res.pageNumber < 0
          ? (res.currentPage = listTotalPages)
          : (res.currentPage = res.pageNumber + 1);
      }

      res.data.map(function(item) {
        item.typeInt = item.type;
        item.type = payTypes[item.typeInt];
        item.time = item.time.slice(0, 16);
      });
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, // 0: server, 1: local-sever, 2: local
    name: {
      // 某一年月份数据
      list: 'list',
    },
    url: {
      list: [
        '/zzhadmin/getTransactionRecordList/',
        '/src/cash/record/mock/list_server.json',
        '/src/cash/record/mock/list.json',
      ],
    },
    requestKeys: {
      list: [
        requestKeysOuter.list,
        requestKeysOuter.list,
        {
          startDate: 'startDate',
          endDate: 'endDate',
          page: 'page',
        },
      ],
    },
    responseRefactor: {
      list: [responseRefactorOuter.list, responseRefactorOuter.list],
    },
    preHandle: {
      list: [preHandleOuter.list, preHandleOuter.list],
    },
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      list: [postHandleOuter.list, postHandleOuter.list],
    },
  });
});
