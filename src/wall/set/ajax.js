import $ from 'jquery';
import seeAjax from 'see-ajax';
import ajaxHandle from './ajax_handle';

const configs = {
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
  requestKeys: {
    template: [
      ajaxHandle.requestKeys.template,
      ajaxHandle.requestKeys.template,
      {
        id: 'id',
      },
    ],
    detail: [
      ajaxHandle.requestKeys.detail,
      ajaxHandle.requestKeys.detail,
      {
        id: 'id',
      },
    ],
    deleteTag: [
      ajaxHandle.requestKeys.deleteTag,
      ajaxHandle.requestKeys.deleteTag,
      {
        id: 'id',
      },
    ],
    createTag: [
      ajaxHandle.requestKeys.createTag,
      ajaxHandle.requestKeys.createTag,
      {
        name: 'name',
      },
    ],
    printerStatus: [
      ajaxHandle.requestKeys.printerStatus,
      ajaxHandle.requestKeys.printerStatus,
      {
        id: 'id',
      },
    ],
    create: [
      ajaxHandle.requestKeys.create,
      ajaxHandle.requestKeys.create,
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
      ajaxHandle.requestKeys.edit,
      ajaxHandle.requestKeys.edit,
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
  responseRefactor: {
    tags: [ajaxHandle.responseRefactor.tags, ajaxHandle.responseRefactor.tags],
    printers: [
      ajaxHandle.responseRefactor.printers,
      ajaxHandle.responseRefactor.printers,
    ],
    template: [
      ajaxHandle.responseRefactor.template,
      ajaxHandle.responseRefactor.template,
    ],
    detail: [
      ajaxHandle.responseRefactor.detail,
      ajaxHandle.responseRefactor.detail,
    ],
    createTag: [
      ajaxHandle.responseRefactor.createTag,
      ajaxHandle.responseRefactor.createTag,
    ],
  },
  preHandle: {
    create: [ajaxHandle.preHandle.create, ajaxHandle.preHandle.create],
    edit: [ajaxHandle.preHandle.edit, ajaxHandle.preHandle.edit],
  },
  postHandle: {
    common: [ajaxHandle.postHandle.common, ajaxHandle.postHandle.common],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('tags', {
  url: configs.url.tags,
  requestKeys: configs.requestKeys.tags,
  preHandle: configs.preHandle.tags,
  responseRefactor: configs.responseRefactor.tags,
  postHandle: configs.postHandle.tags,
});

seeAjax.config('buddhas', {
  url: configs.url.buddhas,
  requestKeys: configs.requestKeys.buddhas,
  preHandle: configs.preHandle.buddhas,
  responseRefactor: configs.responseRefactor.buddhas,
  postHandle: configs.postHandle.buddhas,
});

seeAjax.config('printers', {
  url: configs.url.printers,
  requestKeys: configs.requestKeys.printers,
  preHandle: configs.preHandle.printers,
  responseRefactor: configs.responseRefactor.printers,
  postHandle: configs.postHandle.printers,
});

seeAjax.config('template', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.template,
  requestKeys: configs.requestKeys.template,
  preHandle: configs.preHandle.template,
  responseRefactor: configs.responseRefactor.template,
  postHandle: configs.postHandle.template,
});

seeAjax.config('detail', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.detail,
  requestKeys: configs.requestKeys.detail,
  preHandle: configs.preHandle.detail,
  responseRefactor: configs.responseRefactor.detail,
  postHandle: configs.postHandle.detail,
});

seeAjax.config('deleteTag', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.deleteTag,
  requestKeys: configs.requestKeys.deleteTag,
  preHandle: configs.preHandle.deleteTag,
  responseRefactor: configs.responseRefactor.deleteTag,
  postHandle: configs.postHandle.deleteTag,
});

seeAjax.config('createTag', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.createTag,
  requestKeys: configs.requestKeys.createTag,
  preHandle: configs.preHandle.createTag,
  responseRefactor: configs.responseRefactor.createTag,
  postHandle: configs.postHandle.createTag,
});

seeAjax.config('printerStatus', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.printerStatus,
  requestKeys: configs.requestKeys.printerStatus,
  preHandle: configs.preHandle.printerStatus,
  responseRefactor: configs.responseRefactor.printerStatus,
  postHandle: configs.postHandle.printerStatus,
});

seeAjax.config('create', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.create,
  requestKeys: configs.requestKeys.create,
  preHandle: configs.preHandle.create,
  responseRefactor: configs.responseRefactor.create,
  postHandle: configs.postHandle.create,
});

seeAjax.config('edit', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.edit,
  requestKeys: configs.requestKeys.edit,
  preHandle: configs.preHandle.edit,
  responseRefactor: configs.responseRefactor.edit,
  postHandle: configs.postHandle.edit,
});
