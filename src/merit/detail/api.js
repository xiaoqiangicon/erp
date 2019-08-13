import $ from 'jquery';
import Data from './data';
import commonFunc from 'common/function';
var api = {};
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
api.getBuddhistOrderDetl = function(params, callback) {
  $.seeAjax.get('getBuddhistOrderDetl', params, function(res) {
    res.success
      ? (function() {
          callback && callback(res);
        })()
      : res.message && commonFunc.alert(res.message);
  });
};
api.getWallOrderDetl = function(params, callback) {
  $.seeAjax.get('getWallOrderDetl', params, function(res) {
    res.success
      ? (function() {
          callback && callback(res);
        })()
      : res.message && commonFunc.alert(res.message);
  });
};
export default api;
