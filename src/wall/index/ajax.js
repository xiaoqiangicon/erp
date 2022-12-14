import $ from 'jquery';
import seeAjax from 'see-ajax';
var requestKeys = {
  delete: {
    id: 'id',
  },
  sort: {
    id: 'id',
    sort: 'sort',
  },
};
var responseRefactor = {
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
var preHandle = {};
var postHandle = {
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
const configs = {
  environment: __SEE_ENV__,
  name: {
    list: 'list',
    promotionUrl: 'promotionUrl',
    templates: 'templates',
    delete: 'delete',
    sort: 'sort',
  },
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
  requestKeys: {
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
  },
  responseRefactor: {
    list: [responseRefactor.list, responseRefactor.list],
    promotionUrl: [
      responseRefactor.promotionUrl,
      responseRefactor.promotionUrl,
    ],
    templates: [responseRefactor.templates, responseRefactor.templates],
  },
  preHandle: {},
  postHandle: {
    common: [postHandle.common, postHandle.common],
    list: [postHandle.list, postHandle.list],
    templates: [postHandle.templates, postHandle.templates],
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

seeAjax.config('promotionUrl', {
  url: configs.url.promotionUrl,
  requestKeys: configs.requestKeys.promotionUrl,
  preHandle: configs.preHandle.promotionUrl,
  responseRefactor: configs.responseRefactor.promotionUrl,
  postHandle: configs.postHandle.promotionUrl,
});

seeAjax.config('templates', {
  url: configs.url.templates,
  requestKeys: configs.requestKeys.templates,
  preHandle: configs.preHandle.templates,
  responseRefactor: configs.responseRefactor.templates,
  postHandle: configs.postHandle.templates,
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
