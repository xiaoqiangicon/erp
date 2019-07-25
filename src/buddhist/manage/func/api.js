/**
 *Create by kang on 2018/8/16.
 */
define(['jquery', 'common/function', './data', './ajax'], function(
  $,
  commonFunc,
  Data
) {
  var api = {};

  // 获取佛时进度列表
  api.getBuddhistSchedule = function(params, callback) {
    $.seeAjax.post(
      'getBuddhistSchedule',
      params,
      function(res) {
        if (res.success) {
          Data.buddhistScheduleListHandleData = {};
          res.data.map(function(item) {
            Data.buddhistScheduleListHandleData[item.id] = item;
          });
          callback && callback(res);
        } else {
          res.message && commonFunc.alert(res.message);
        }
      },
      true
    );
  };

  // 创建或编辑佛事进度
  api.updateBuddhistSchedule = function(params, callback) {
    $.seeAjax.post(
      'updateBuddhistSchedule',
      params,
      function(res) {
        if (res.success) {
          callback && callback(res);
        } else {
          res.message && commonFunc.alert(res.message);
        }
      },
      true
    );
  };

  return api;
});
