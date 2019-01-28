/**
 * Created by senntyou on 2017/3/29.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    list: {
      year: 'year',
      page: 'pageNumber',
    },
  };
  var responseRefactorOuter = {
    list: {
      data: [
        {
          money: 'price',
          count: 'order_num',
          available: 'surplusPickUpMoney',
          taken: 'pickUpMoney',
        },
      ],
    },
    accountInfo: {
      status: 'authBankType',
      data: {
        bank: 'bankName',
        subBank: 'bankBranchName',
        bankCard: 'bankCardNumber',
        account: 'bankCardUserName',
        licenceImage: 'certificatePicUrl',
        idCardImage1: 'identityCardPic',
        idCardImage2: 'identityCardPic2',
        reason: 'examineMessage',
      },
    },
  };
  var preHandleOuter = {
    list: function(data) {
      delete data.pageNumber;
    },
  };
  var postHandleOuter = {
    common: function(res) {
      res.success = res.result >= 0;
      !!res.msg && (res.message = res.msg);
    },
    stat: function(res) {
      res.data = {};
      res.data.total = res.sumPrice;
      res.data.available = res.canPickUpMoney;
      res.data.taken = res.pickUpMoney;
      res.data.chanzai = res.chanzaiOrderMoney;
    },
    list: function(res) {
      res.currentPage = 1;
      res.totalPages = 1;
      res.data.map(function(item) {
        var monthArray = item.month.split('-');

        item.year = parseInt(monthArray[0]);
        item.month = parseInt(monthArray[1]);

        item.remain = item.available - item.taken;
      });
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, // 0: server, 1: local-sever, 2: local
    name: {
      // 统计数据
      stat: 'stat',
      // 某一年月份数据
      list: 'list',
      // 以前账户
      accountInfo: 'accountInfo',
    },
    url: {
      stat: [
        '/zzhadmin/getSumMoney/',
        '/src/cash/index/mock/stat_server.json',
        '/src/cash/index/mock/stat.json',
      ],
      list: [
        '/zzhadmin/moneyCntList/',
        '/src/cash/index/mock/list_server.json',
        '/src/cash/index/mock/list.json',
      ],
      accountInfo: [
        '/zzhadmin/getTempleBank/',
        '/src/cash/account/edit/mock/info_server.json',
        '/src/cash/account/edit/mock/info.json',
      ],
    },
    requestKeys: {
      list: [
        requestKeysOuter.list,
        requestKeysOuter.list,
        {
          year: 'year',
          page: 'page',
        },
      ],
    },
    responseRefactor: {
      list: [responseRefactorOuter.list, responseRefactorOuter.list],
      accountInfo: [
        responseRefactorOuter.accountInfo,
        responseRefactorOuter.accountInfo,
      ],
    },
    preHandle: {
      list: [preHandleOuter.list, preHandleOuter.list],
    },
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      stat: [postHandleOuter.stat, postHandleOuter.stat],
      list: [postHandleOuter.list, postHandleOuter.list],
    },
  });
});
