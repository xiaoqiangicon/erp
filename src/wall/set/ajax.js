/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'see-ajax', './ajax_handle', 'lib/jquery.seeAjax'], function(
  $,
  seeAjax,
  ajaxHandle
) {
  var env = 0;

  seeAjax.setEnv(env);

  $.seeAjax.config({
    environment: env, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      // 标签列表
      tags: 'tags',
      // 佛像列表
      buddhas: 'buddhas',
      // 打印机列表
      printers: 'printers',
      // 获取一个模板数据
      template: 'template',
      // 获取已编辑过的详细信息
      detail: 'detail',
      // 删除一个标签
      deleteTag: 'deleteTag',
      // 创建标签
      createTag: 'createTag',
      // 获取打印机状态
      printerStatus: 'printerStatus',
      // 创建
      create: 'create',
      // 编辑
      edit: 'edit',
    },
    //url请求地址
    url: {
      tags: [
        '/zzhadmin/buddhaWallTagList/',
        '/src/wall/set/mock/tags_server.json',
        '/src/wall/set/mock/tags.json',
      ],
      buddhas: [
        '/zzhadmin/buddhaList/',
        '/src/wall/set/mock/buddhas_server.json',
        '/src/wall/set/mock/buddhas.json',
      ],
      printers: [
        '/zzhadmin/getPrinterList/',
        '/src/wall/set/mock/printers_server.json',
        '/src/wall/set/mock/printers.json',
      ],
      template: [
        '/zzhadmin/buddhaWall_template/',
        '/src/wall/set/mock/template_server.json',
        '/src/wall/set/mock/template.json',
      ],
      detail: [
        '/zzhadmin/buddhaWall_getBuddha/',
        '/src/wall/set/mock/detail_server.json',
        '/src/wall/set/mock/detail.json',
      ],
      deleteTag: [
        '/zzhadmin/buddhaWall_delTag/',
        '/src/wall/set/mock/delete_tag_server.json',
        '/src/wall/set/mock/delete_tag.json',
      ],
      createTag: [
        '/zzhadmin/buddhaWall_createTag/',
        '/src/wall/set/mock/create_tag_server.json',
        '/src/wall/set/mock/create_tag.json',
      ],
      printerStatus: [
        '/zzhadmin/getPrinterStatus/',
        '/src/wall/set/mock/printer_status_server.json',
        '/src/wall/set/mock/printer_status.json',
      ],
      create: [
        '/zzhadmin/buddhaWall_createBuddha/',
        '/src/wall/set/mock/create_server.json',
        '/src/wall/set/mock/create.json',
      ],
      edit: [
        '/zzhadmin/buddhaWall_editBuddha/',
        '/src/wall/set/mock/edit_server.json',
        '/src/wall/set/mock/edit.json',
      ],
    },
    // 请求参数
    requestKeys: {
      template: [
        ajaxHandle.requestKeysOuter.template,
        ajaxHandle.requestKeysOuter.template,
        {
          id: 'id',
        },
      ],
      detail: [
        ajaxHandle.requestKeysOuter.detail,
        ajaxHandle.requestKeysOuter.detail,
        {
          id: 'id',
        },
      ],
      deleteTag: [
        ajaxHandle.requestKeysOuter.deleteTag,
        ajaxHandle.requestKeysOuter.deleteTag,
        {
          id: 'id',
        },
      ],
      createTag: [
        ajaxHandle.requestKeysOuter.createTag,
        ajaxHandle.requestKeysOuter.createTag,
        {
          name: 'name',
        },
      ],
      printerStatus: [
        ajaxHandle.requestKeysOuter.printerStatus,
        ajaxHandle.requestKeysOuter.printerStatus,
        {
          id: 'id',
        },
      ],
      create: [
        ajaxHandle.requestKeysOuter.create,
        ajaxHandle.requestKeysOuter.create,
        {
          name: 'name',
          category: 'category',
          buddhaId: 'buddhaId',
          tags: 'tags',
          place: 'place',
          cover: 'cover',
          previewImages: 'previewImages',
          intro: 'intro',
          randomMoney: 'randomMoney',
          memoConfig: 'memoConfig',
          usePrinter: 'usePrinter',
          printers: 'printers',
          printType: 'printType',
          printPages: 'printPages',
          shareTitle: 'shareTitle',
          shareContent: 'shareContent',
          shareImage: 'shareImage',
        },
      ],
      edit: [
        ajaxHandle.requestKeysOuter.edit,
        ajaxHandle.requestKeysOuter.edit,
        {
          id: 'id',
          name: 'name',
          category: 'category',
          buddhaId: 'buddhaId',
          tags: 'tags',
          place: 'place',
          cover: 'cover',
          previewImages: 'previewImages',
          intro: 'intro',
          randomMoney: 'randomMoney',
          memoConfig: 'memoConfig',
          usePrinter: 'usePrinter',
          printers: 'printers',
          printType: 'printType',
          printPages: 'printPages',
          shareTitle: 'shareTitle',
          shareContent: 'shareContent',
          shareImage: 'shareImage',
        },
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      tags: [
        ajaxHandle.responseRefactorOuter.tags,
        ajaxHandle.responseRefactorOuter.tags,
      ],
      printers: [
        ajaxHandle.responseRefactorOuter.printers,
        ajaxHandle.responseRefactorOuter.printers,
      ],
      template: [
        ajaxHandle.responseRefactorOuter.template,
        ajaxHandle.responseRefactorOuter.template,
      ],
      detail: [
        ajaxHandle.responseRefactorOuter.detail,
        ajaxHandle.responseRefactorOuter.detail,
      ],
      createTag: [
        ajaxHandle.responseRefactorOuter.createTag,
        ajaxHandle.responseRefactorOuter.createTag,
      ],
    },
    //ajax请求前置处理
    preHandle: {
      create: [
        ajaxHandle.preHandleOuter.create,
        ajaxHandle.preHandleOuter.create,
      ],
      edit: [ajaxHandle.preHandleOuter.edit, ajaxHandle.preHandleOuter.edit],
    },
    //ajax请求后置处理
    postHandle: {
      common: [
        ajaxHandle.postHandleOuter.common,
        ajaxHandle.postHandleOuter.common,
      ],
    },
  });
});
