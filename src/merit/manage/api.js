import seeAjax from 'see-ajax';
import $ from 'jquery';
import Data from './data';
import commonFunc from 'common/function';
var api = {};
api.getList = function(params, callback) {
  seeAjax('getList', params, function(res) {
    res.success
      ? (function() {
          Data.getListRes = res;
          callback && callback(res);
        })()
      : res.message && commonFunc.alert(res.message);
  });
};
api.getTag = function(params, callback) {
  seeAjax('getTag', params, function(res) {
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
  });
};
api.updateTag = function(params, callback) {
  seeAjax(
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
api.delTag = function(params, callback) {
  seeAjax('delTag', params, function(res) {
    res.success
      ? (function() {
          callback && callback(res);
        })()
      : res.message && commonFunc.alert(res.message);
  });
};
api.addMeritToGroup = function(params, callback) {
  seeAjax(
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
api.delMeritFromGroup = function(params, callback) {
  seeAjax('delMeritFromGroup', params, function(res) {
    res.success
      ? (function() {
          callback && callback(res);
        })()
      : res.message && commonFunc.alert(res.message);
  });
};
export default api;
