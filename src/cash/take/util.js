import $ from 'jquery';
import commonVars from 'common/variables';
var $body = $('body');
var util = {};
util.getExtremeDate = function(year, month) {
  var date = new Date(year, month, 0),
    lastDay = date.getDate(),
    m = ('' + month).length > 1 ? '' + month : '0' + month;
  return {
    start: '' + year + '-' + m + '-' + '01',
    end: '' + year + '-' + m + '-' + lastDay,
  };
};
util.getDateInt = function(dateStr) {
  return parseInt(
    dateStr.slice(0, 4) + dateStr.slice(5, 7) + dateStr.slice(8, 10)
  );
};
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
util.disableBodyScroll = function() {
  $body.addClass('overflow-hidden');
};
util.enableBodyScroll = function() {
  $body.removeClass('overflow-hidden');
};
export default util;
