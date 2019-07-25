/**
 * Created by kang on 2017/11/21.
 * 添加/编辑简介
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    // 上传字段的映射，左侧本地，右侧服务器
    getScene: {
      type: 'type',
    },
    getSceneSet: {
      sceneId: 'sceneId',
    },
    updateSet: {
      sceneId: 'sceneId',
      summary: 'introduce',
      sound: 'introduceVoice',
      pic: 'introducePic',
    },
  };
  var responseRefactorOuter = {
    // 返回字段的映射，左侧本地数据名称，右侧服务器名称
    getScene: {
      data: [
        {
          sceneId: 'id',
          sceneName: 'name',
          summary: 'introduce',
          sound: 'introduceVoice',
          pic: 'introducePic',
        },
      ],
    },
    getSceneSet: {
      data: {
        sceneId: 'id',
        sceneName: 'name',
        summary: 'introduce',
        sound: 'introduceVoice',
        pic: 'introducePic',
      },
    },
  };
  var preHandleOuter = {};
  var postHandleOuter = {
    // ajax请求后置处理
    common: function(res) {
      // success field
      res.success = res.result >= 0;
      // message field
      typeof res.msg !== 'undefined' && (res.message = res.msg);
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      getScene: 'getScene', // 获取场景 也是设置
      getSceneSet: 'getSceneSet', // 获取场景设置详情
      updateSet: 'updateSet', // 更新设置
    },
    //url请求地址
    url: {
      getScene: [
        '/zzhadmin/vr_sceneList/',
        '/src/vrshow/create_summary/mock/get_set_server.json',
        '/src/vrshow/create_summary/mock/get_set.json',
      ],
      getSceneSet: ['/zzhadmin/vr_sceneGet/'],
      updateSet: [
        '/zzhadmin/vr_sceneEdit/',
        '/src/vrshow/success.json',
        '/src/vrshow/success.json',
      ],
    },
    // 修改请求参数的映射
    requestKeys: {
      getScene: [requestKeysOuter.getScene, requestKeysOuter.getScene],
      getSceneSet: [requestKeysOuter.getSceneSet, requestKeysOuter.getSceneSet],
      updateSet: [requestKeysOuter.updateSet, requestKeysOuter.updateSet],
    },
    // 修改返回参数的映射
    responseRefactor: {
      getScene: [
        responseRefactorOuter.getScene,
        responseRefactorOuter.getScene,
      ],
      getSceneSet: [
        responseRefactorOuter.getSceneSet,
        responseRefactorOuter.getSceneSet,
      ],
    },
    //ajax请求前置处理
    preHandle: {},
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
    },
  });
});
