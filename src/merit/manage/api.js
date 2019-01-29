define(['jquery', './data', 'common/function'], function($, Data, commonFunc) {
  var api = {};
  // 请求列表数据
  api.getList = function(params, callback) {
    $.seeAjax.post(
      'getList',
      params,
      function(res) {
        res.success
          ? (function() {
              Data.getListRes = res;
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
  // 更新标签 修改 添加
  api.updateTag = function(params, callback) {
    $.seeAjax.post(
      'updateTag',
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
  // 删除标签
  api.delTag = function(params, callback) {
    $.seeAjax.post(
      'delTag',
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
  // 将功德主从分组移除
  api.delMeritFromGroup = function(params, callback) {
    $.seeAjax.post(
      'delMeritFromGroup',
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

  return api;
});
