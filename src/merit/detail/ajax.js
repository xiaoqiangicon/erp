/**
 * Created by kang on 2017/11/8.
 */

define(['jquery', 'lunar-calendar', 'lib/jquery.seeAjax'], function(
  $,
  LunarCalendar
) {
  var requestKeysOuter = {
    // 左侧本地，右侧服务器
    getList: {
      page: 'pageNum',
      pageSize: 'pageSize',
      id: 'id',
    },
    getUserInfo: {
      id: 'id',
    },
    getTag: {
      userId: 'userId',
    },
    addMeritToGroup: {
      tagIds: 'groupId',
      userIds: 'userIds',
    },
    getWallOrderDetl: {
      id: 'id',
    },
    getBuddhistOrderDetl: {
      id: 'orderId',
    },
  };
  var responseRefactorOuter = {
    // 左侧本地数据名称，右侧服务器名称
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
  var preHandleOuter = {
    getList: function(data) {},
  };
  var postHandleOuter = {
    common: function(res) {
      // success field
      res.success = res.result >= 0;
      // message field
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

  $.seeAjax.config({
    environment: __SEE_ENV__, //环境标识（用于数组选值）：0->服务器环境, 1->本地服务器测试，2->本地环境
    //所有请求的名字，这里可以是对象，也可是数组，但请不要使用“common”字段和值
    name: {
      getList: 'getList', // 获取列表
      getUserInfo: 'getUserInfo', // 获取用户信息
      getTag: 'getTag', // 获取标签
      addMeritToGroup: 'addMeritToGroup', // 将功德主添加分组
      getWallOrderDetl: 'getWallOrderDetl', // 获取功德主 供佛墙订单详情 type = 4
      getBuddhistOrderDetl: 'getBuddhistOrderDetl', // 获取功德主 佛事订单详情 type = 2
    },
    //url请求地址
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
    // 请求参数
    requestKeys: {
      getList: [requestKeysOuter.getList, requestKeysOuter.getList],
      getUserInfo: [requestKeysOuter.getUserInfo, requestKeysOuter.getUserInfo],
      getTag: [requestKeysOuter.getTag, requestKeysOuter.getTag],
      addMeritToGroup: [
        requestKeysOuter.addMeritToGroup,
        requestKeysOuter.addMeritToGroup,
      ],
      getWallOrderDetl: [
        requestKeysOuter.getWallOrderDetl,
        requestKeysOuter.getWallOrderDetl,
      ],
      getBuddhistOrderDetl: [
        requestKeysOuter.getBuddhistOrderDetl,
        requestKeysOuter.getBuddhistOrderDetl,
      ],
    },
    // 重新格式化json数据
    responseRefactor: {
      getList: [responseRefactorOuter.getList, responseRefactorOuter.getList],
      getTag: [responseRefactorOuter.getTag, responseRefactorOuter.getTag],
      getWallOrderDetl: [
        responseRefactorOuter.getWallOrderDetl,
        responseRefactorOuter.getWallOrderDetl,
      ],
    },
    //ajax请求前置处理
    preHandle: {
      getList: [preHandleOuter.getList, preHandleOuter.getList],
    },
    //ajax请求后置处理
    postHandle: {
      common: [postHandleOuter.common, postHandleOuter.common],
      getList: [postHandleOuter.getList, postHandleOuter.getList],
    },
  });
});
