import $ from 'jquery';
import seeAjax from 'see-ajax';
var requestKeys = {
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
var responseRefactor = {
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
var preHandle = {};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    res.msg && (res.message = res.msg);
  },
};
const configs = {
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
  requestKeys: {
    list: [
      requestKeys.list,
      requestKeys.list,
      {
        place: 'place',
        buddha: 'buddha',
      },
    ],
    delete: [
      requestKeys.delete,
      requestKeys.delete,
      {
        id: 'id',
      },
    ],
    sort: [
      requestKeys.sort,
      requestKeys.sort,
      {
        id: 'id',
        sort: 'sort',
      },
    ],
    freeze: [
      requestKeys.freeze,
      requestKeys.freeze,
      {
        id: 'id',
        status: 'status',
      },
    ],
    create: [
      requestKeys.create,
      requestKeys.create,
      {
        name: 'name',
        rows: 'rows',
        columns: 'columns',
        code: 'code',
        buddhaId: 'buddhaId',
        nonSeatCode: 'nonSeatCode',
      },
    ],
    detail: [
      requestKeys.detail,
      requestKeys.detail,
      {
        id: 'id',
      },
    ],
  },
  responseRefactor: {
    list: [responseRefactor.list, responseRefactor.list],
    detail: [responseRefactor.detail, responseRefactor.detail],
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

seeAjax.config('list', {
  url: configs.url.list,
  requestKeys: configs.requestKeys.list,
  preHandle: configs.preHandle.list,
  responseRefactor: configs.responseRefactor.list,
  postHandle: configs.postHandle.list,
});

seeAjax.config('delete', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.delete,
  requestKeys: configs.requestKeys.delete,
  preHandle: configs.preHandle.delete,
  responseRefactor: configs.responseRefactor.delete,
  postHandle: configs.postHandle.delete,
});

seeAjax.config('sort', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.sort,
  requestKeys: configs.requestKeys.sort,
  preHandle: configs.preHandle.sort,
  responseRefactor: configs.responseRefactor.sort,
  postHandle: configs.postHandle.sort,
});

seeAjax.config('buddhaList', {
  url: configs.url.buddhaList,
  requestKeys: configs.requestKeys.buddhaList,
  preHandle: configs.preHandle.buddhaList,
  responseRefactor: configs.responseRefactor.buddhaList,
  postHandle: configs.postHandle.buddhaList,
});

seeAjax.config('freeze', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.freeze,
  requestKeys: configs.requestKeys.freeze,
  preHandle: configs.preHandle.freeze,
  responseRefactor: configs.responseRefactor.freeze,
  postHandle: configs.postHandle.freeze,
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

seeAjax.config('detail', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.detail,
  requestKeys: configs.requestKeys.detail,
  preHandle: configs.preHandle.detail,
  responseRefactor: configs.responseRefactor.detail,
  postHandle: configs.postHandle.detail,
});

seeAjax.config('shortBuddhaList', {
  url: configs.url.shortBuddhaList,
  requestKeys: configs.requestKeys.shortBuddhaList,
  preHandle: configs.preHandle.shortBuddhaList,
  responseRefactor: configs.responseRefactor.shortBuddhaList,
  postHandle: configs.postHandle.shortBuddhaList,
});
