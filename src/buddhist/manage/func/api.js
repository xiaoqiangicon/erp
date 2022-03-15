import $ from 'jquery';
import seeAjax from 'see-ajax';
import commonFunc from 'common/function';
import Data from './data';
import './ajax';
var api = {};
api.getBuddhistSchedule = function(params, callback) {
  seeAjax('getBuddhistSchedule', params, function(res) {
    if (res.success) {
      Data.buddhistScheduleListHandleData = {};
      res.data.map(function(item) {
        Data.buddhistScheduleListHandleData[item.id] = item;
      });
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
    }
  });
};
api.updateBuddhistSchedule = function(params, callback) {
  seeAjax('updateBuddhistSchedule', params, function(res) {
    if (res.success) {
      callback && callback(res);
    } else {
      res.message && commonFunc.alert(res.message);
      Data.isSubmit = 0;
    }
  });
};
export default api;
