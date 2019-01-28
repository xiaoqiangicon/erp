/**
 * Created by senntyou on 2017/8/3.
 */

define(['jquery', 'lib/jquery.seeAjax'], function($) {
  var requestKeysOuter = {
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
  var responseRefactorOuter = {
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
  var preHandleOuter = {
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
      // 当前区域详情
      detail: 'detail',
      // 保存
      save: 'save',
      // 编辑位置信息
      editSeats: 'editSeats',
    },
    //url请求地址
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
    // 请求参数
    requestKeys: {
      detail: [
        requestKeysOuter.detail,
        requestKeysOuter.detail,
        {
          id: 'id',
        },
      ],
      save: [
        requestKeysOuter.save,
        requestKeysOuter.save,
        {
          id: 'id',
          priceList: 'priceList',
        },
      ],
      editSeats: [
        requestKeysOuter.editSeats,
        requestKeysOuter.editSeats,
        {
          id: 'id',
          seats: 'seats',
        },
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      detail: [responseRefactorOuter.detail, responseRefactorOuter.detail],
    },
    //ajax请求前置处理
    preHandle: {
      save: [preHandleOuter.save, preHandleOuter.save],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
    },
  });
});
