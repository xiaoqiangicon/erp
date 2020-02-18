import $ from 'jquery';
import seeAjax from 'see-ajax';
import handleAjaxError from '../../../com/handle-ajax-error';

var requestKeys = {
  add: {
    bank: 'bankName',
    subBank: 'bankBranchName',
    bankCard: 'bankCardNumber',
    account: 'bankCardUserName',
    licenceImage: 'certificatePicUrl',
    idCardImage1: 'identityCardPic',
    idCardImage2: 'identityCardPic2',
  },
  update: {
    bank: 'bankName',
    subBank: 'bankBranchName',
    bankCard: 'bankCardNumber',
    account: 'bankCardUserName',
    licenceImage: 'certificatePicUrl',
    idCardImage1: 'identityCardPic',
    idCardImage2: 'identityCardPic2',
  },
};
var responseRefactor = {
  info: {
    data: {
      bank: 'bankName',
      subBank: 'bankBranchName',
      bankCard: 'bankCardNumber',
      account: 'bankCardUserName',
      licenceImage: 'certificatePicUrl',
      idCardImage1: 'identityCardPic',
      idCardImage2: 'identityCardPic2',
    },
  },
};
var preHandle = {};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    res.message = res.msg || '';

    handleAjaxError(res);
  },
};

const configs = {
  url: {
    add: [
      '/zzhadmin/addTempleBank/',
      '/src/cash/account/edit/mock/add_server.json',
      '/src/cash/account/edit/mock/add.json',
    ],
    update: [
      '/zzhadmin/updateTempleBank/',
      '/src/cash/account/edit/mock/update_server.json',
      '/src/cash/account/edit/mock/update.json',
    ],
    info: [
      '/zzhadmin/getTempleBank/',
      '/src/cash/account/edit/mock/info_server.json',
      '/src/cash/account/edit/mock/info.json',
    ],
  },
  requestKeys: {
    add: [requestKeys.add, requestKeys.add],
    update: [requestKeys.update, requestKeys.update],
  },
  responseRefactor: {
    info: [responseRefactor.info, responseRefactor.info],
  },
  preHandle: {},
  postHandle: {
    common: [postHandle.common, postHandle.common],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('add', {
  method: ['post'],
  url: configs.url.add,
  requestKeys: configs.requestKeys.add,
  preHandle: configs.preHandle.add,
  responseRefactor: configs.responseRefactor.add,
  postHandle: configs.postHandle.add,
});

seeAjax.config('update', {
  method: ['post'],
  url: configs.url.update,
  requestKeys: configs.requestKeys.update,
  preHandle: configs.preHandle.update,
  responseRefactor: configs.responseRefactor.update,
  postHandle: configs.postHandle.update,
});

seeAjax.config('info', {
  url: configs.url.info,
  requestKeys: configs.requestKeys.info,
  preHandle: configs.preHandle.info,
  responseRefactor: configs.responseRefactor.info,
  postHandle: configs.postHandle.info,
});
