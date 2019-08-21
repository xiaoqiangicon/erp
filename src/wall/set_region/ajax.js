import $ from 'jquery';
import seeAjax from 'see-ajax';
var requestKeys = {
  detail: {
    id: 'wallId',
  },
  save: {
    id: 'wallId',
    priceList: 'wallList',
  },
  editSeats: {
    id: 'wallId',
    seats: 'numberText',
  },
};
var responseRefactor = {
  detail: {
    data: {
      rows: 'row',
      columns: 'col',
      seats: 'numberText',
      nonSeatCode: 'noSeatList',
      priceList: 'wallList',
      _priceList: [
        {
          prices: 'priceArray',
          _prices: [
            {
              type: 'priceType',
            },
          ],
        },
      ],
    },
  },
};
var preHandle = {
  save: function(req) {
    JSON.refactor(req.wallList, [
      {
        priceArray: 'prices',
        _priceArray: [
          {
            priceType: 'type',
          },
        ],
      },
    ]);
  },
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    res.msg && (res.message = res.msg);
  },
};
const configs = {
  url: {
    detail: [
      '/zzhadmin/buddhaWall_getWall/',
      '/src/wall/set_region/mock/detail_server.json',
      '/src/wall/set_region/mock/detail.json',
    ],
    save: [
      '/zzhadmin/buddhaWall_editWall/',
      '/src/wall/set_region/mock/save_server.json',
      '/src/wall/set_region/mock/save.json',
    ],
    editSeats: [
      '/zzhadmin/buddhaWall_editWallSeat/',
      '/src/wall/set_region/mock/edit_seats_server.json',
      '/src/wall/set_region/mock/edit_seats.json',
    ],
  },
  requestKeys: {
    detail: [
      requestKeys.detail,
      requestKeys.detail,
      {
        id: 'id',
      },
    ],
    save: [
      requestKeys.save,
      requestKeys.save,
      {
        id: 'id',
        priceList: 'priceList',
      },
    ],
    editSeats: [
      requestKeys.editSeats,
      requestKeys.editSeats,
      {
        id: 'id',
        seats: 'seats',
      },
    ],
  },
  responseRefactor: {
    detail: [responseRefactor.detail, responseRefactor.detail],
  },
  preHandle: {
    save: [preHandle.save, preHandle.save],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
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

seeAjax.config('save', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.save,
  requestKeys: configs.requestKeys.save,
  preHandle: configs.preHandle.save,
  responseRefactor: configs.responseRefactor.save,
  postHandle: configs.postHandle.save,
});

seeAjax.config('editSeats', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.editSeats,
  requestKeys: configs.requestKeys.editSeats,
  preHandle: configs.preHandle.editSeats,
  responseRefactor: configs.responseRefactor.editSeats,
  postHandle: configs.postHandle.editSeats,
});
