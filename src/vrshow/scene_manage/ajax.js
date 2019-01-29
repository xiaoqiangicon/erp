/**
 * Created by kang on 2017/11/20.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    // 上传字段的映射，左侧本地，右侧服务器
    getSceneList: {
      type: 'type',
    },
    deleteScene: {
      sceneId: 'sceneId',
    },
    getLinkList: {},
    updateLink: {
      id: 'id', // 传0新增
      sceneId: 'sceneId',
      title: 'title',
      url: 'url',
    },
    deleteLink: {
      id: 'id',
      status: 'status',
    },
  };
  var responseRefactorOuter = {
    // 返回字段的映射，左侧本地数据名称，右侧服务器名称
    getSceneList: {
      data: [
        {
          sceneId: 'id',
          sceneName: 'name',
          summary: 'introduce',
          sound: 'introduceVoice',
        },
      ],
    },
    getLinkList: {
      data: [
        {
          id: 'id',
          title: 'title',
          sceneId: 'sceneId',
          sceneName: 'sceneName',
          url: 'url',
        },
      ],
    },
  };
  var preHandleOuter = {
    // ajax请求前置处理
    getSceneList: function(data) {},
  };
  var postHandleOuter = {
    // ajax请求后置处理
    common: function(res) {
      // success field
      res.success = res.result >= 0;
      // message field
      typeof res.msg != 'undefined' && (res.message = res.msg);
    },
    getSceneList: function(res) {},
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      getSceneList: 'getSceneList', // 获取简介列表 获取场景列表
      deleteScene: 'deleteScene', // 删除场景
      getLinkList: 'getLinkList', // 获取链接列表
      updateLink: 'updateLink', // 更新链接（添加/修改）
      deleteLink: 'deleteLink', // 删除链接
    },
    //url请求地址
    url: {
      getSceneList: [
        '/zzhadmin/vr_sceneList/',
        '/src/vrshow/scene_manage/mock/get_list_server.json',
        '/src/vrshow/scene_manage/mock/get_list.json',
      ],
      deleteScene: [
        '/zzhadmin/vr_sceneIntroduceDel/',
        '/src/vrshow/scene_manage/mock/success.json',
        '/src/vrshow/scene_manage/mock/success.json',
      ],
      getLinkList: [
        '/zzhadmin/vr_activityList/',
        '/src/vrshow/scene_manage/mock/get_link_list_server.json',
        '/src/vrshow/scene_manage/mock/get_link_list.json',
      ],
      updateLink: [
        '/zzhadmin/vr_activityEdit/',
        '/src/vrshow/scene_manage/mock/success.json',
        '/src/vrshow/scene_manage/mock/success.json',
      ],
      deleteLink: [
        '/zzhadmin/vr_activityDel/',
        '/src/vrshow/scene_manage/mock/success.json',
        '/src/vrshow/scene_manage/mock/success.json',
      ],
    },
    // 修改请求参数的映射
    requestKeys: {
      getSceneList: [
        requestKeysOuter.getSceneList,
        requestKeysOuter.getSceneList,
      ],
      deleteScene: [requestKeysOuter.deleteScene, requestKeysOuter.deleteScene],
      getLinkList: [requestKeysOuter.getLinkList, requestKeysOuter.getLinkList],
      updateLink: [requestKeysOuter.updateLink, requestKeysOuter.updateLink],
      deleteLink: [requestKeysOuter.deleteLink, requestKeysOuter.deleteLink],
    },
    // 修改返回参数的映射
    responseRefactor: {
      getSceneList: [
        responseRefactorOuter.getSceneList,
        responseRefactorOuter.getSceneList,
      ],
      getLinkList: [
        responseRefactorOuter.getLinkList,
        responseRefactorOuter.getLinkList,
      ],
    },
    //ajax请求前置处理
    preHandle: {
      getSceneList: [preHandleOuter.getSceneList, preHandleOuter.getSceneList],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      getSceneList: [
        postHandleOuter.getSceneList,
        postHandleOuter.getSceneList,
      ],
    },
  });
});
