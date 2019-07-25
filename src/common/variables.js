/**
 * 全局变量
 * define(['common/variables'], function(commonVars) {
 *     // commonVars.params
 *     // commonVars.cookies
 *     // commonVars.today = {
 *     //     year: //当前4位年份
 *     //     month: // 当前月份 1-12
 *     //     weekDay: // 当前星期 0-6 (日-六)
 *     //     day: // 当前几号
 *     //     display: // 显示，如 2017-01-01
 *     // }
 * });
 *
 * Created by senntyou on 2017/4/1.
 */
define(function() {
  var data = {
    //获取Url的参数
    params: (function() {
      var params = {};
      !!location.search &&
        location.search
          .slice(1)
          .split('&')
          .map(function(item) {
            params[item.split('=')[0]] = item.split('=')[1];
          });
      return params;
    })(),
    // 今天
    today: (function() {
      // 当前日期对象
      var currentDateObj = new Date(),
        year = currentDateObj.getFullYear(),
        month = currentDateObj.getMonth() + 1,
        day = currentDateObj.getDate();

      return {
        year: year, // 当前4位年份
        month: month, // 当前月份 1-12
        weekDay: currentDateObj.getDay(), // 当前星期 0-6 (日-六)
        day: day, // 当前几号
        display:
          '' +
          year +
          '-' +
          (('' + month).length > 1 ? '' + month : '0' + month) +
          '-' +
          (('' + day).length > 1 ? '' + day : '0' + day),
      };
    })(),
    // cookies
    cookies: (function() {
      var cookieString = window.document.cookie,
        cookieArray = cookieString.split(';'),
        cookies = {};

      cookieArray.map(function(item) {
        var itemArray = item.split('=');
        cookies[itemArray[0].trim()] = !!itemArray[1]
          ? itemArray[1].trim()
          : '';
      });
      return cookies;
    })(),
  };

  return data;
});
