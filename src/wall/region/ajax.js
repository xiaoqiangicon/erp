import $ from 'jquery';
import 'lib/jquery.seeAjax';
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
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    list: 'list',
    delete: 'delete',
    sort: 'sort',
    buddhaList: 'buddhaList',
    freeze: 'freeze',
    create: 'create',
    detail: 'detail',
    shortBuddhaList: 'shortBuddhaList',
  },
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
});
