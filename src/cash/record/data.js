import $ from 'jquery';
import juicer from 'juicer';
import seeAjax from 'see-ajax';
import { renderPagination, renderPaginationContent } from './render';

var data = {};
data.today = (function() {
  var currentDateObj = new Date(),
    year = currentDateObj.getFullYear(),
    month = currentDateObj.getMonth() + 1,
    day = currentDateObj.getDate();
  return {
    year: year,
    month: month,
    weekDay: currentDateObj.getDay(),
    day: day,
    display:
      '' +
      year +
      '-' +
      (('' + month).length > 1 ? '' + month : '0' + month) +
      '-' +
      (('' + day).length > 1 ? '' + day : '0' + day),
  };
})();
data.params = (function() {
  var params = {};
  !!location.search &&
    location.search
      .slice(1)
      .split('&')
      .map(function(item) {
        params[item.split('=')[0]] = item.split('=')[1];
      });
  return params;
})();
data.orderInfo = {};
data.tpl = {
  paginationContainer: juicer($('#tpl-pagination-container').html()),
  dateContentContainer: juicer($('#tpl-date-content-container').html()),
  paginationContentContainer: juicer(
    $('#tpl-pagination-content-container').html()
  ),
  placeholder: $('#tpl-placeholder').html(),
  detailUnit: juicer($('#tpl-detail-unit').html()),
  pagination: juicer($('#tpl-pagination').html()),
  popup: juicer($('#tpl-popup').html()),
};
data.requestList = function(startDate, endDate, page) {
  !startDate && (startDate = '');
  !endDate && (endDate = '');
  !page && (page = 1);
  seeAjax(
    'list',
    {
      startDate: startDate,
      endDate: endDate,
      page: page,
    },
    function(res) {
      res.success &&
        (renderPaginationContent(res.data, {
          startDate: startDate,
          endDate: endDate,
          page: page,
        }),
        renderPagination(
          {
            currentPage: page,
            totalPages: res.totalPages,
            startDate: startDate,
            endDate: endDate,
          },
          {
            startDate: startDate,
            endDate: endDate,
          }
        ),
        res.data.map(function(item) {
          data.orderInfo[item.orderId] = item;
        }));
    }
  );
};
data.getExtremeDate = function(year, month) {
  var date = new Date(year, month, 0),
    lastDay = date.getDate(),
    m = ('' + month).length > 1 ? '' + month : '0' + month;
  return {
    start: '' + year + '-' + m + '-' + '01',
    end: '' + year + '-' + m + '-' + lastDay,
  };
};
data.getDateInt = function(dateStr) {
  return parseInt(
    dateStr.slice(0, 4) + dateStr.slice(5, 7) + dateStr.slice(8, 10)
  );
};
data.getDateStartFromToday = function(intervalMonths) {
  var year = data.today.year,
    month = data.today.month,
    day = data.today.day,
    intervalYear = 0,
    targetLastDay;
  !intervalMonths && (intervalMonths = 0);
  month -= intervalMonths;
  month <= 0 &&
    ((intervalYear = Math.abs(Math.floor((month - 1) / 12))),
    (year -= intervalYear),
    (month += intervalYear * 12));
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
export default data;
