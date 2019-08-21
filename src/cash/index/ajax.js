import $ from 'jquery';
import 'lib/jquery.seeAjax';
var requestKeys = {
  list: {
    year: 'year',
    page: 'pageNumber',
  },
};
var responseRefactor = {
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
var preHandle = {
  list: function(data) {
    delete data.pageNumber;
  },
};
var postHandle = {
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
  environment: __SEE_ENV__,
  name: {
    stat: 'stat',
    list: 'list',
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
      requestKeys.list,
      requestKeys.list,
      {
        year: 'year',
        page: 'page',
      },
    ],
  },
  responseRefactor: {
    list: [responseRefactor.list, responseRefactor.list],
    accountInfo: [responseRefactor.accountInfo, responseRefactor.accountInfo],
  },
  preHandle: {
    list: [preHandle.list, preHandle.list],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    stat: [postHandle.stat, postHandle.stat],
    list: [postHandle.list, postHandle.list],
  },
});
