import $ from "jquery";
import Data from "./data";
import commonFunc from "common/function";
var api = {};
api.getList = function (params, callback) {
  $.seeAjax.post("getList", params, function (res) {
    res.success ? (function () {
      Data.getListRes = res;
      callback && callback(res);
    })() : res.message && commonFunc.alert(res.message);
  }, true);
};
api.getTag = function (params, callback) {
  $.seeAjax.post("getTag", params, function (res) {
    res.success ? (function () {
      Data.getTagRes = res;
      Data.getTagHandleData = {};
      res.data.map(function (item) {
        Data.getTagHandleData[item.id] = item;
      });
      callback && callback(res);
    })() : res.message && commonFunc.alert(res.message);
  }, true);
};
api.updateTag = function (params, callback) {
  $.seeAjax.post("updateTag", params, function (res) {
    res.success ? (function () {
      callback && callback(res);
    })() : res.message && commonFunc.alert(res.message);
  }, true);
};
api.delTag = function (params, callback) {
  $.seeAjax.post("delTag", params, function (res) {
    res.success ? (function () {
      callback && callback(res);
    })() : res.message && commonFunc.alert(res.message);
  }, true);
};
api.addMeritToGroup = function (params, callback) {
  $.seeAjax.post("addMeritToGroup", params, function (res) {
    res.success ? (function () {
      callback && callback(res);
    })() : res.message && commonFunc.alert(res.message);
  }, true);
};
api.delMeritFromGroup = function (params, callback) {
  $.seeAjax.post("delMeritFromGroup", params, function (res) {
    res.success ? (function () {
      callback && callback(res);
    })() : res.message && commonFunc.alert(res.message);
  }, true);
};
export default api;
