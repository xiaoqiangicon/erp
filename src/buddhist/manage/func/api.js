import $ from "jquery";
import commonFunc from "common/function";
import Data from "./data";
import "./ajax";
var api = {};
api.getBuddhistSchedule = function (params, callback) {
  $.seeAjax.post("getBuddhistSchedule", params, function (res) {
    if (res.success) {
      Data.buddhistScheduleListHandleData = {};
      res.data.map(function (item) {
        Data.buddhistScheduleListHandleData[item.id] = item;
      });
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  }, true);
};
api.updateBuddhistSchedule = function (params, callback) {
  $.seeAjax.post("updateBuddhistSchedule", params, function (res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  }, true);
};
export default api;
