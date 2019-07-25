/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'common/variables'], function($, commonVars) {
  var $body = $('body');

  var util = {};

  /**
   * 根据年月获取两端日期
   *
   * example: getExtremeDate(2017, 9)
   *     -> {start: '2017-09-01', end: '2017-09-30'}
   *
   * @param year
   * @param month
   * @returns {{start: string, end: string}}
   */
  util.getExtremeDate = function(year, month) {
    // 当前月最后一天的日期对象
    var date = new Date(year, month, 0),
      lastDay = date.getDate(),
      m = ('' + month).length > 1 ? '' + month : '0' + month;

    return {
      start: '' + year + '-' + m + '-' + '01',
      end: '' + year + '-' + m + '-' + lastDay,
    };
  };

  /**
   * 根据时间字符串获取int来比较大小
   *
   * example: 2017-09-01 -> 20170901
   *
   * @param dateStr
   * @returns {Number}
   */
  util.getDateInt = function(dateStr) {
    return parseInt(
      dateStr.slice(0, 4) + dateStr.slice(5, 7) + dateStr.slice(8, 10)
    );
  };

  /**
   * 根据间隔，返回距离今天多少个月前的日期
   *
   * @param intervalMonths
   * @returns {string}
   */
  util.getDateStartFromToday = function(intervalMonths) {
    var year = commonVars.today.year,
      month = commonVars.today.month,
      day = commonVars.today.day,
      intervalYear = 0,
      targetLastDay;

    !intervalMonths && (intervalMonths = 0);

    month -= intervalMonths;
    if (month <= 0) {
      intervalYear = Math.abs(Math.floor((month - 1) / 12));
      year -= intervalYear;
      month += intervalYear * 12;
    }

    targetLastDay = new Date(year, month, 0).getDate();

    targetLastDay < day && (day = targetLastDay);

    return (
      '' +
      year +
      '-' +
      (('' + month).length > 1 ? '' + month : '0' + month) +
      '-' +
      (('' + day).length > 1 ? '' + day : '0' + day)
    );
  };

  /**
   * 阻止body滚动
   */
  util.disableBodyScroll = function() {
    $body.addClass('overflow-hidden');
  };

  /**
   * 恢复body滚动
   */
  util.enableBodyScroll = function() {
    $body.removeClass('overflow-hidden');
  };

  return util;
});
