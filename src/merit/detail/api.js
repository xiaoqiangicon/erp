define(['jquery', './data', 'common/function'], function($, Data, commonFunc) {
  var api = {};

  // 获取功德主订单列表数据 返回用户的userId
  api.getList = function(params, callback) {
    $.seeAjax.post(
      'getList',
      params,
      function(res) {
        res.success
          ? (function() {
              Data.getListRes = res;
              Data.getUserInfoParams.id = res.data.userId;
              callback && callback(res);
            })()
          : res.message && commonFunc.alert(res.message);
      },
      true
    );
  };
  // 获取用户信息
  api.getUserInfo = function(params, callback) {
    $.seeAjax.post(
      'getUserInfo',
      params,
      function(res) {
        res.success
          ? (function() {
              Data.getUserInfoRes = res;
              callback && callback(res);
            })()
          : res.message && commonFunc.alert(res.message);
      },
      true
    );
  };
  // 请求标签列表
  api.getTag = function(params, callback) {
    $.seeAjax.post(
      'getTag',
      params,
      function(res) {
        res.success
          ? (function() {
              Data.getTagRes = res;
              Data.getTagHandleData = {};
              res.data.map(function(item) {
                Data.getTagHandleData[item.id] = item;
              });
              callback && callback(res);
            })()
          : res.message && commonFunc.alert(res.message);
      },
      true
    );
  };
  // 将功德主添加进分组
  api.addMeritToGroup = function(params, callback) {
    $.seeAjax.post(
      'addMeritToGroup',
      params,
      function(res) {
        res.success
          ? (function() {
              callback && callback(res);
            })()
          : res.message && commonFunc.alert(res.message);
      },
      true
    );
  };
  // 获取佛事订单详情
  api.getBuddhistOrderDetl = function(params, callback) {
    $.seeAjax.get('getBuddhistOrderDetl', params, function(res) {
      res.success
        ? (function() {
            callback && callback(res);
          })()
        : res.message && commonFunc.alert(res.message);
    });
  };
  // 获取供佛墙订单详情
  api.getWallOrderDetl = function(params, callback) {
    $.seeAjax.get('getWallOrderDetl', params, function(res) {
      res.success
        ? (function() {
            callback && callback(res);
          })()
        : res.message && commonFunc.alert(res.message);
    });
  };

  return api;
});
