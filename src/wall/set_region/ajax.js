import $ from 'jquery';
import 'lib/jquery.seeAjax';
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
$.seeAjax.config({
  environment: __SEE_ENV__,
  name: {
    detail: 'detail',
    save: 'save',
    editSeats: 'editSeats',
  },
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
});
