import $ from 'jquery';
import seeAjax from 'see-ajax';
import handleAjaxError from '../../com/handle-ajax-error';
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
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    !!res.msg && (res.message = res.msg);

    handleAjaxError(res);
  },
  stat: function(res) {
    res.data = {};
    res.data.total = res.sumPrice;
    res.data.available = res.canPickUpMoney;
    res.data.taken = res.pickUpMoney;
    res.data.chanzai = res.chanzaiOrderMoney;
  },
  list: function(res) {
    res.data.map(function(item) {
      var monthArray = item.month.split('-');
      item.year = parseInt(monthArray[0]);
      item.month = parseInt(monthArray[1]);
      item.remain = item.available - item.taken;
    });
  },
};
const configs = {
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
  responseRefactor: {
    list: [responseRefactor.list, responseRefactor.list],
    accountInfo: [responseRefactor.accountInfo, responseRefactor.accountInfo],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    stat: [postHandle.stat, postHandle.stat],
    list: [postHandle.list, postHandle.list],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('stat', {
  url: configs.url.stat,
  responseRefactor: configs.responseRefactor.stat,
  postHandle: configs.postHandle.stat,
});

seeAjax.config('list', {
  url: configs.url.list,
  responseRefactor: configs.responseRefactor.list,
  postHandle: configs.postHandle.list,
});

seeAjax.config('accountInfo', {
  url: configs.url.accountInfo,
  responseRefactor: configs.responseRefactor.accountInfo,
  postHandle: configs.postHandle.accountInfo,
});
