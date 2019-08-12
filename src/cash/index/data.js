import $ from "jquery";
import "juicer";
import "lib/jquery.seeAjax";
var data = {
  monthsData: {},
  monthDataForChart: {},
  currentHandleId: 0,
  accountStatus: globalData.accountStatus
};
data.today = (function () {
  var currentDateObj = new Date();
  return {
    year: currentDateObj.getFullYear(),
    month: currentDateObj.getMonth() + 1,
    weekDay: currentDateObj.getDay(),
    day: currentDateObj.getDate()
  };
})();
data.tpl = {
  selectYearItem: juicer($("#tpl-select-year-item").html()),
  paginationContainer: juicer($("#tpl-pagination-container").html()),
  yearContentContainer: juicer($("#tpl-year-content-container").html()),
  paginationContentContainer: juicer($("#tpl-pagination-content-container").html()),
  placeholder: $("#tpl-placeholder").html(),
  detailUnit: juicer($("#tpl-detail-unit").html()),
  pagination: juicer($("#tpl-pagination").html())
};
data.requestList = function (year, page) {
  !year && (year = data.today.year);
  !page && (page = 1);
  $.seeAjax.get("list", {
    year: year,
    page: page
  }, function (res) {
    res.success && ($.seeBind.setData("pagination-content", res.data, {
      year: year,
      page: page
    }), $.seeBind.setData("pagination", {
      currentPage: page,
      totalPages: res.totalPages,
      year: year
    }, {
      year: year
    }), !data.monthsData[year] && (data.monthsData[year] = {}, data.monthDataForChart[year] = {}), data.monthsData[year][page] = res.data, data.monthDataForChart[year][page] = [], res.data.map(function (item) {
      data.monthDataForChart[year][page][item.month - 1] = item.money;
    }), $.seeBind.setData("chart", {
      year: year,
      months: data.monthDataForChart[year][page]
    }));
  });
};
export default data;
