import $ from "jquery";
import func from "../function";
import data from "../data";
var util = {};
util.refreshCurrentPage = function () {
  var currentPage = parseInt($(".pagination-cell.active").attr("data-current-page"));
  if (data.currentTabType == 1) {
    func.requestUnhandledOrdersList(currentPage);
  } else {
    func.requestHandledOrdersList(currentPage);
  }
};
export default util;
