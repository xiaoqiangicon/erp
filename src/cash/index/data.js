/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'juicer', 'lib/jquery.seeAjax'], function($) {
  var data = {
    // 分页数据
    monthsData: {},
    monthDataForChart: {},
    // 当前正在处理的ID
    currentHandleId: 0,
    // -1 未添加账户信息 0 待审核 1 审核通过 2 审核不通过
    accountStatus: globalData.accountStatus,
  };

  // 今天
  data.today = (function() {
    // 当前日期对象
    var currentDateObj = new Date();

    return {
      year: currentDateObj.getFullYear(), // 当前4位年份
      month: currentDateObj.getMonth() + 1, // 当前月份 1-12
      weekDay: currentDateObj.getDay(), // 当前星期 0-6 (日-六)
      day: currentDateObj.getDate(), // 当前几号
    };
  })();

  // 模板
  data.tpl = {
    selectYearItem: juicer($('#tpl-select-year-item').html()),
    paginationContainer: juicer($('#tpl-pagination-container').html()),
    yearContentContainer: juicer($('#tpl-year-content-container').html()),
    paginationContentContainer: juicer(
      $('#tpl-pagination-content-container').html()
    ),
    placeholder: $('#tpl-placeholder').html(),
    detailUnit: juicer($('#tpl-detail-unit').html()),
    pagination: juicer($('#tpl-pagination').html()),
  };

  data.requestList = function(year, page) {
    !year && (year = data.today.year);
    !page && (page = 1);

    $.seeAjax.get('list', { year: year, page: page }, function(res) {
      res.success &&
        ($.seeBind.setData('pagination-content', res.data, {
          year: year,
          page: page,
        }),
        $.seeBind.setData(
          'pagination',
          {
            currentPage: page,
            totalPages: res.totalPages,
            year: year,
          },
          { year: year }
        ),
        // 保存数据
        !data.monthsData[year] &&
          ((data.monthsData[year] = {}), (data.monthDataForChart[year] = {})),
        (data.monthsData[year][page] = res.data),
        (data.monthDataForChart[year][page] = []),
        res.data.map(function(item) {
          data.monthDataForChart[year][page][item.month - 1] = item.money;
        }),
        $.seeBind.setData('chart', {
          year: year,
          months: data.monthDataForChart[year][page],
        }));
    });
  };

  return data;
});
