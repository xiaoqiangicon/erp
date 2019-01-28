/**
 * 使用说明
 *
 * define(['common/util/date'], function(dateUtil) {
 *     dateUtil.getNumberOfDate(dateString): 获取某个日期的数字表示，用来比较大小
 *     dateUtil.isValidDate(dateString): 合格格式日期的验证
 * });
 *
 * Created by senntyou on 2017/9/30.
 */

define(function() {
  var util = {};

  // 获取某个日期的数字表示，用来比较大小
  util.getNumberOfDate = function(dateString) {
    return parseInt(dateString.split('-').join(''));
  };

  // 合格格式日期的验证
  util.isValidDate = function(dateString) {
    var dateArray = dateString.split('-');
    // 长度为3个
    if (dateArray.length != 3) return !1;
    if (
      dateArray[0].length != 4 ||
      dateArray[1].length != 2 ||
      dateArray[2].length != 2
    )
      return !1;
    if (!new Date(dateString).getTime()) return !1;
    return !0;
  };

  return util;
});
