/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    delete: {
      id: 'id',
    },
    sort: {
      id: 'id',
      sort: 'sort',
    },
  };
  var responseRefactorOuter = {
    list: {
      data: [
        {
          cover: 'coverPic',
          sequence: 'sort',
          regions: 'wallName',
        },
      ],
    },
    promotionUrl: {
      url: 'data',
    },
    templates: {
      data: [
        {
          id: 'templateId',
          image: 'coverPic',
          category: 'type',
        },
      ],
    },
  };
  var preHandleOuter = {};
  var postHandleOuter = {
    common: function(res) {
      res.success = res.result >= 0;
      res.msg && (res.message = res.msg);
    },
    list: function(res) {
      res.data &&
        res.data.length &&
        res.data.map(function(item) {
          item.regions == '暂无设置' && (item.regions = '');
        });
    },
    templates: function(res) {
      res.data &&
        res.data.length &&
        res.data.map(function(item) {
          item.category && (item.category -= 1);
        });
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 请求列表
      list: 'list',
      // 获取推广地址
      promotionUrl: 'promotionUrl',
      // 模板列表
      templates: 'templates',
      // 删除一个项目
      delete: 'delete',
      // 更新一个项目排序
      sort: 'sort',
    },
    //url请求地址
    url: {
      list: [
        '/zzhadmin/buddhaWallBuddhaList/',
        '/src/wall/index/mock/list_server.json',
        '/src/wall/index/mock/list.json',
      ],
      promotionUrl: [
        '/zzhadmin/buddhaWall_url/',
        '/src/wall/index/mock/promotion_url_server.json',
        '/src/wall/index/mock/promotion_url.json',
      ],
      templates: [
        '/zzhadmin/buddhaWall_templateList/',
        '/src/wall/index/mock/templates_server.json',
        '/src/wall/index/mock/templates.json',
      ],
      delete: [
        '/zzhadmin/buddhaWall_delBuddha/',
        '/src/wall/index/mock/delete_server.json',
        '/src/wall/index/mock/delete.json',
      ],
      sort: [
        '/zzhadmin/buddhaWall_buddhaSort/',
        '/src/wall/index/mock/sort_server.json',
        '/src/wall/index/mock/sort.json',
      ],
    },
    // 请求参数
    requestKeys: {
      delete: [
        requestKeysOuter.delete,
        requestKeysOuter.delete,
        {
          id: 'id',
        },
      ],
      sort: [
        requestKeysOuter.sort,
        requestKeysOuter.sort,
        {
          id: 'id',
          sort: 'sort',
        },
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      list: [responseRefactorOuter.list, responseRefactorOuter.list],
      promotionUrl: [
        responseRefactorOuter.promotionUrl,
        responseRefactorOuter.promotionUrl,
      ],
      templates: [
        responseRefactorOuter.templates,
        responseRefactorOuter.templates,
      ],
    },
    //ajax请求前置处理
    preHandle: {},
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      list: [postHandleOuter.list, postHandleOuter.list],
      templates: [postHandleOuter.templates, postHandleOuter.templates],
    },
  });
});
