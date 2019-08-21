import $ from 'jquery';
import LunarCalendar from 'lunar-calendar';
import seeAjax from 'see-ajax';
var requestKeys = {
  getList: {
    page: 'pageNum',
  },
  getUserInfo: {},
  getTag: {},
  addMeritToGroup: {
    tagIds: 'groupId',
  },
  getWallOrderDetl: {},
  getBuddhistOrderDetl: {
    id: 'orderId',
  },
};
var responseRefactor = {
  getList: {},
  getTag: {
    data: [
      {
        id: 'id',
        name: 'name',
        num: 'members',
      },
    ],
  },
  getWallOrderDetl: {
    data: {
      name: 'buddhaName',
      sequence: 'number',
      time: 'addTime',
      money: 'price',
      type: 'supplyType',
      orderNumber: 'transactionId',
      flowNumber: 'prepayId',
      feedImage: 'dispose_pic_url',
      contactList: [
        {
          phone: 'mobile',
          birth: 'birthday',
          lunar: 'isLunar',
        },
      ],
      yangShangRen: 'alivePeople',
      wangShengZhe: 'deadman',
    },
  },
  getBuddhistOrderDetl: {},
};
var preHandle = {
  getList: function(data) {},
};
var postHandle = {
  common: function(res) {
    res.success = res.result >= 0;
    typeof res.msg != 'undefined' && (res.message = res.msg);
  },
  getWallOrderDetl: function(res) {
    res.data.contactList &&
      res.data.contactList.map(function(item) {
        if (item.birth) {
          var birthData = item.birth.split('-');
          var year = parseInt(birthData[0]);
          var month = parseInt(birthData[1]);
          var day = parseInt(birthData[2]);
          if (item.lunar) {
            var lunarData = LunarCalendar.solarToLunar(year, month, day);
            item.birth =
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
      });
  },
};
const configs = {
  url: {
    getList: [
      '/zzhadmin/getMerit/',
      '/src/merit/detail/mock/list_server.json',
      '/src/merit/detail/mock/list.json',
    ],
    getUserInfo: [
      '/zzhadmin/getMeritUserInfo/',
      '/src/merit/detail/mock/user_info_server.json',
      '/src/merit/detail/mock/user_info.json',
    ],
    getTag: ['/zzhadmin/getMeritUserGroupList/'],
    addMeritToGroup: ['/zzhadmin/addMeritToGroup/'],
    getWallOrderDetl: ['/zzhadmin/buddhaWall_getOrder/'],
    getBuddhistOrderDetl: ['/zzhadmin/getCeremonyOrder/'],
  },
  requestKeys: {
    getList: [requestKeys.getList, requestKeys.getList],
    getUserInfo: [requestKeys.getUserInfo, requestKeys.getUserInfo],
    getTag: [requestKeys.getTag, requestKeys.getTag],
    addMeritToGroup: [requestKeys.addMeritToGroup, requestKeys.addMeritToGroup],
    getWallOrderDetl: [
      requestKeys.getWallOrderDetl,
      requestKeys.getWallOrderDetl,
    ],
    getBuddhistOrderDetl: [
      requestKeys.getBuddhistOrderDetl,
      requestKeys.getBuddhistOrderDetl,
    ],
  },
  responseRefactor: {
    getList: [responseRefactor.getList, responseRefactor.getList],
    getTag: [responseRefactor.getTag, responseRefactor.getTag],
    getWallOrderDetl: [
      responseRefactor.getWallOrderDetl,
      responseRefactor.getWallOrderDetl,
    ],
  },
  preHandle: {
    getList: [preHandle.getList, preHandle.getList],
  },
  postHandle: {
    common: [postHandle.common, postHandle.common],
    getList: [postHandle.getList, postHandle.getList],
  },
};

seeAjax.setEnv(__SEE_ENV__);

seeAjax.config('common', {
  postHandle: configs.postHandle.common,
});

seeAjax.config('getList', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.getList,
  requestKeys: configs.requestKeys.getList,
  preHandle: configs.preHandle.getList,
  responseRefactor: configs.responseRefactor.getList,
  postHandle: configs.postHandle.getList,
});

seeAjax.config('getUserInfo', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.getUserInfo,
  requestKeys: configs.requestKeys.getUserInfo,
  preHandle: configs.preHandle.getUserInfo,
  responseRefactor: configs.responseRefactor.getUserInfo,
  postHandle: configs.postHandle.getUserInfo,
});

seeAjax.config('getTag', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.getTag,
  requestKeys: configs.requestKeys.getTag,
  preHandle: configs.preHandle.getTag,
  responseRefactor: configs.responseRefactor.getTag,
  postHandle: configs.postHandle.getTag,
});

seeAjax.config('addMeritToGroup', {
  method: ['post'],
  stringify: [!0],
  url: configs.url.addMeritToGroup,
  requestKeys: configs.requestKeys.addMeritToGroup,
  preHandle: configs.preHandle.addMeritToGroup,
  responseRefactor: configs.responseRefactor.addMeritToGroup,
  postHandle: configs.postHandle.addMeritToGroup,
});

seeAjax.config('getWallOrderDetl', {
  url: configs.url.getWallOrderDetl,
  requestKeys: configs.requestKeys.getWallOrderDetl,
  preHandle: configs.preHandle.getWallOrderDetl,
  responseRefactor: configs.responseRefactor.getWallOrderDetl,
  postHandle: configs.postHandle.getWallOrderDetl,
});

seeAjax.config('getBuddhistOrderDetl', {
  url: configs.url.getBuddhistOrderDetl,
  requestKeys: configs.requestKeys.getBuddhistOrderDetl,
  preHandle: configs.preHandle.getBuddhistOrderDetl,
  responseRefactor: configs.responseRefactor.getBuddhistOrderDetl,
  postHandle: configs.postHandle.getBuddhistOrderDetl,
});
