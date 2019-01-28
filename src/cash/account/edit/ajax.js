/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'see-ajax', 'lib/jquery.seeAjax'], function($, seeAjax) {
  var requestKeysOuter = {
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
  var responseRefactorOuter = {
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
  var preHandleOuter = {};
  var postHandleOuter = {
    common: function(res) {
      res.success = res.result >= 0;
      res.message = res.msg || '';
    },
  };

  var env = __SEE_ENV__;

  seeAjax.default.setEnv(env);
  $.seeAjax.config({
    environment: env, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 添加
      add: 'add',
      // 更新
      update: 'update',
      // 以前保存的信息
      info: 'info',
    },
    //url请求地址
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
    // 请求参数
    requestKeys: {
      add: [
        requestKeysOuter.add,
        requestKeysOuter.add,
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
        requestKeysOuter.update,
        requestKeysOuter.update,
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
    // 重新格式化json数据
    responseRefactor: {
      info: [responseRefactorOuter.info, responseRefactorOuter.info],
    },
    //ajax请求前置处理
    preHandle: {},
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
    },
  });
});
