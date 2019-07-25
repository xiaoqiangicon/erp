/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
    list: {
      place: 'hallName',
      buddha: 'buddhaId',
    },
    delete: {
      id: 'wallId',
    },
    sort: {
      id: 'id',
      sort: 'sort',
    },
    freeze: {
      id: 'wallId',
      status: 'status',
    },
    create: {
      name: 'name',
      rows: 'row',
      columns: 'col',
      code: 'numberText',
      buddhaId: 'buddhaId',
      nonSeatCode: 'noSeatList',
    },
    detail: {
      id: 'wallId',
    },
  };
  var responseRefactorOuter = {
    list: {
      data: [
        {
          sequence: 'sort',
          place: 'name',
          name: 'buddhaName',
          remain: 'total',
          rows: 'row',
          columns: 'col',
        },
      ],
    },
    detail: {
      data: {
        nonSeatCode: 'noSeatList',
        seats: 'numberText',
        rows: 'row',
        columns: 'col',
      },
    },
  };
  var preHandleOuter = {};
  var postHandleOuter = {
    common: function(res) {
      res.success = res.result >= 0;
      res.msg && (res.message = res.msg);
    },
  };

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 请求列表
      list: 'list',
      // 删除一个项目
      delete: 'delete',
      // 更新一个项目排序
      sort: 'sort',
      // 供奉佛像列表
      buddhaList: 'buddhaList',
      // 冻结
      freeze: 'freeze',
      // 创建
      create: 'create',
      // 项目详情
      detail: 'detail',
      // 佛像列表
      shortBuddhaList: 'shortBuddhaList',
    },
    //url请求地址
    url: {
      list: [
        '/zzhadmin/buddhaWallWallList/',
        '/src/wall/region/mock/list_server.json',
        '/src/wall/region/mock/list.json',
      ],
      delete: [
        '/zzhadmin/buddhaWall_delWall/',
        '/src/wall/region/mock/delete_server.json',
        '/src/wall/region/mock/delete.json',
      ],
      sort: [
        '/zzhadmin/buddhaWall_wallSort/',
        '/src/wall/region/mock/sort_server.json',
        '/src/wall/region/mock/sort.json',
      ],
      buddhaList: [
        '/zzhadmin/buddhaWallBuddhaList/',
        '/src/wall/index/mock/list_server.json',
        '/src/wall/index/mock/list.json',
      ],
      freeze: [
        '/zzhadmin/buddhaWall_activateWall/',
        '/src/wall/region/mock/freeze_server.json',
        '/src/wall/region/mock/freeze.json',
      ],
      create: [
        '/zzhadmin/buddhaWall_createWall/',
        '/src/wall/region/mock/create_server.json',
        '/src/wall/region/mock/create.json',
      ],
      detail: [
        '/zzhadmin/buddhaWall_getWall/',
        '/src/wall/region/mock/detail_server.json',
        '/src/wall/region/mock/detail.json',
      ],
      shortBuddhaList: [
        '/zzhadmin/buddhaWall_buddhaNameList/',
        '/src/wall/region/mock/short_buddha_list_server.json',
        '/src/wall/region/mock/short_buddha_list.json',
      ],
    },
    // 请求参数
    requestKeys: {
      list: [
        requestKeysOuter.list,
        requestKeysOuter.list,
        {
          place: 'place',
          buddha: 'buddha',
        },
      ],
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
      freeze: [
        requestKeysOuter.freeze,
        requestKeysOuter.freeze,
        {
          id: 'id',
          // 0：激活，1：冻结
          status: 'status',
        },
      ],
      create: [
        requestKeysOuter.create,
        requestKeysOuter.create,
        {
          name: 'name', // 名字
          rows: 'rows', // 行数
          columns: 'columns', // 列数
          code: 'code', // 位置代码
          buddhaId: 'buddhaId', // 供奉佛像ID
          nonSeatCode: 'nonSeatCode', // 无位置信息代码
        },
      ],
      detail: [
        requestKeysOuter.detail,
        requestKeysOuter.detail,
        {
          id: 'id',
        },
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      list: [responseRefactorOuter.list, responseRefactorOuter.list],
      detail: [responseRefactorOuter.detail, responseRefactorOuter.detail],
    },
    //ajax请求前置处理
    preHandle: {},
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
    },
  });
});
