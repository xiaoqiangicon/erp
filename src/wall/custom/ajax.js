import $ from 'jquery';
import LunarCalendar from 'lunar-calendar';
import seeAjax from 'see-ajax';
var requestKeys = {
  orders: {
    regionId: 'wallId',
    remainDays: 'endDays',
    search: 'searchText',
    page: 'pageIndex',
  },
  detail: {
    id: 'recordId',
  },
  delete: {
    id: 'id',
  },
};
var responseRefactor = {
  regions: {
    data: [
      {
        memoConfig: 'postScript',
        _memoConfig: [
          {
            type: 'input_type',
            tip: 'prompt_text',
            length: 'font_length',
          },
        ],
      },
    ],
  },
  orders: {
    data: [
      {
        name: 'writeName',
        recordTime: 'addTime',
      },
    ],
  },
  detail: {
    data: {
      name: 'writeName',
      sequence: 'number',
      yangShangRen: 'alivePeople',
      wangShengZhe: 'deadman',
    },
  },
};
var preHandle = {
  orders: function(req) {
    req.pageSize = 20;
    req.pageIndex -= 1;
    !req.endDays && (req.endDays = 0);
  },
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    res.msg && (res.message = res.msg);
  },
  regions: function(res) {
    res.data &&
      res.data.length &&
      res.data.map(function(item) {
        var nameArray = item.name.split('-');
        nameArray.shift();
        item.shortedName = nameArray.join('-');
      });
  },
  orders: function(res) {
    res.totalPages = res.total ? Math.ceil(res.total / 20) : 1;
    res.data &&
      res.data.length &&
      res.data.map(function(item) {
        var contactNames = [];
        item.contactList &&
          item.contactList.length &&
          item.contactList.map(function(contactItem) {
            contactNames.push(contactItem.name);
          });
        item.contactNames = contactNames.join('<br>');
      });
  },
  detail: function(res) {
    if (res.data.contactList) {
      var contactListArray = res.data.contactList.split(',');
      res.data.contactList = [];
      contactListArray.map(function(item) {
        var itemArray = item.split('|');
        var newItem = {
          name: itemArray[0],
          phone: itemArray[1],
        };
        if (itemArray[2]) {
          var birthData = itemArray[2].split('-');
          var lunar = parseInt(birthData[3]);
          var year = parseInt(birthData[0]);
          var month = parseInt(birthData[1]);
          var day = parseInt(birthData[2]);
          newItem.lunar = lunar;
          if (!lunar)
            newItem.birth =
              birthData[0] + '-' + birthData[1] + '-' + birthData[2];
          else {
            var lunarData = LunarCalendar.solarToLunar(year, month, day);
            newItem.birth =
              lunarData.lunarYear +
              '-' +
              (lunarData.lunarMonth > 9
                ? lunarData.lunarMonth
                : '0' + lunarData.lunarMonth) +
              '-' +
              (lunarData.lunarDay > 9
                ? lunarData.lunarDay
                : '0' + lunarData.lunarDay);
          }
        }
        res.data.contactList.push(newItem);
      });
    } else {
      res.data.contactList = [];
    }
  },
};
const configs = {
  url: {
    houses: [
      '/zzhadmin/buddhaWall_hallList/',
      '/src/wall/record/mock/houses_server.json',
      '/src/wall/record/mock/houses.json',
    ],
    regions: [
      '/zzhadmin/buddhaWallWallList/',
      '/src/wall/remind/mock/regions_server.json',
      '/src/wall/remind/mock/regions.json',
    ],
    orders: [
      '/zzhadmin/buddhaWall_recordList/',
      '/src/wall/custom/mock/orders_server.json',
      '/src/wall/custom/mock/orders.json',
    ],
    detail: [
      '/zzhadmin/buddhaWall_getRecord/',
      '/src/wall/custom/mock/detail_server.json',
      '/src/wall/custom/mock/detail.json',
    ],
    delete: [
      '/zzhadmin/buddhaWall_delrecord/',
      '/src/wall/custom/mock/delete_server.json',
      '/src/wall/custom/mock/delete.json',
    ],
  },
  requestKeys: {
    orders: [
      requestKeys.orders,
      requestKeys.orders,
      {
        regionId: 'regionId',
        remainDays: 'remainDays',
        search: 'search',
        page: 'page',
      },
    ],
    detail: [
      requestKeys.detail,
      requestKeys.detail,
      {
        id: 'id',
      },
    ],
    delete: [
      requestKeys.delete,
      requestKeys.delete,
      {
        id: 'id',
      },
    ],
  },
  responseRefactor: {
    regions: [responseRefactor.regions, responseRefactor.regions],
    orders: [responseRefactor.orders, responseRefactor.orders],
    detail: [responseRefactor.detail, responseRefactor.detail],
  },
  preHandle: {
    orders: [preHandle.orders, preHandle.orders],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    regions: [postHandle.regions, postHandle.regions],
    orders: [postHandle.orders, postHandle.orders],
    detail: [postHandle.detail, postHandle.detail],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('houses', {
  url: configs.url.houses,
  requestKeys: configs.requestKeys.houses,
  preHandle: configs.preHandle.houses,
  responseRefactor: configs.responseRefactor.houses,
  postHandle: configs.postHandle.houses,
});

seeAjax.config('regions', {
  url: configs.url.regions,
  requestKeys: configs.requestKeys.regions,
  preHandle: configs.preHandle.regions,
  responseRefactor: configs.responseRefactor.regions,
  postHandle: configs.postHandle.regions,
});

seeAjax.config('orders', {
  url: configs.url.orders,
  requestKeys: configs.requestKeys.orders,
  preHandle: configs.preHandle.orders,
  responseRefactor: configs.responseRefactor.orders,
  postHandle: configs.postHandle.orders,
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

seeAjax.config('delete', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.delete,
  requestKeys: configs.requestKeys.delete,
  preHandle: configs.preHandle.delete,
  responseRefactor: configs.responseRefactor.delete,
  postHandle: configs.postHandle.delete,
});
