import $ from 'jquery';
import seeAjax from 'see-ajax';
import 'lib/jquery.seeAjax';
var requestKeys = {
  add: {
    type: 'type',
    bank: 'bankName',
    subBank: 'bankBranchName',
    bankCard: 'bankCardNumber',
    account: 'bankCardUserName',
    licenceImage: 'certificatePicUrl',
    idCardImage1: 'identityCardPic',
    idCardImage2: 'identityCardPic2',
  },
  update: {
    type: 'type',
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
  },
};
var env = __SEE_ENV__;
seeAjax.setEnv(env);
$.seeAjax.config({
  environment: env,
  name: {
    add: 'add',
    update: 'update',
    info: 'info',
  },
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
    add: [
      requestKeys.add,
      requestKeys.add,
      {
        type: 'type',
        bank: 'bank',
        subBank: 'subBank',
        bankCard: 'bankCard',
        account: 'account',
        licenceImage: 'licenceImage',
        idCardImage1: 'idCardImage1',
        idCardImage2: 'idCardImage2',
      },
    ],
    update: [
      requestKeys.update,
      requestKeys.update,
      {
        type: 'type',
        bank: 'bank',
        subBank: 'subBank',
        bankCard: 'bankCard',
        account: 'account',
        licenceImage: 'licenceImage',
        idCardImage1: 'idCardImage1',
        idCardImage2: 'idCardImage2',
      },
    ],
  },
  responseRefactor: {
    info: [responseRefactor.info, responseRefactor.info],
  },
  preHandle: {},
  postHandle: {
    common: [postHandle.common, postHandle.common],
  },
});
