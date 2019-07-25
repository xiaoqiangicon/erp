/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'juicer', 'lib/jquery.seeAjax'], function($) {
  var data = {};

  // 今天
  data.today = (function() {
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
  })();

  //获取Url的参数
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

  // 订单数据
  data.orderInfo = {}; // id -> {}

  // 模板
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

    $.seeAjax.get(
      'list',
      { startDate: startDate, endDate: endDate, page: page },
      function(res) {
        res.success &&
          ($.seeBind.setData('pagination-content', res.data, {
            startDate: startDate,
            endDate: endDate,
            page: page,
          }),
          $.seeBind.setData(
            'pagination',
            {
              currentPage: page,
              totalPages: res.totalPages,
              startDate: startDate,
              endDate: endDate,
            },
            { startDate: startDate, endDate: endDate }
          ),
          // 存储数据
          res.data.map(function(item) {
            data.orderInfo[item.orderId] = item;
          }));
      }
    );
  };

  // 根据年月获取两端日期
  data.getExtremeDate = function(year, month) {
    // 当前月最后一天的日期对象
    var date = new Date(year, month, 0),
      lastDay = date.getDate(),
      m = ('' + month).length > 1 ? '' + month : '0' + month;

    return {
      start: '' + year + '-' + m + '-' + '01',
      end: '' + year + '-' + m + '-' + lastDay,
    };
  };

  // 根据时间字符串获取int来比较大小
  data.getDateInt = function(dateStr) {
    return parseInt(
      dateStr.slice(0, 4) + dateStr.slice(5, 7) + dateStr.slice(8, 10)
    );
  };

  // 根据间隔，返回距离今天多少个月前的日期
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

  return data;
});
