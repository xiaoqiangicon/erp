import $ from "jquery";
import Toast from "old/toast";
import data from "./data";
import tpl from "./tpl";
import func from "./function";
import "./ajax";
import "lib/jquery.seeView";
$.seeView({
  events: {
    "click #query": "query",
    "click #reset": "reset",
    "click #export-excel": "exportExcel",
    "click #prevPage": "onClickPrevPage",
    "click #nextPage": "onClickNextPage"
  },
  query: function (e) {
    var $beginDate = $("#beginDate"), beginDate = $beginDate.val(), $endDate = $("#endDate"), endDate = $endDate.val();
    data.pageNum = 0;
    data.getListParams.beginDate = beginDate;
    data.getListParams.endDate = endDate;
    func.getList(data.getListParams, function (res) {
      func.renderList(res);
    });
  },
  reset: function (e) {
    $("#beginDate").val("");
    $("#endDate").val("");
    $("#query").click();
  },
  exportExcel: function (e) {
    var $beginDate = $("#beginDate"), beginDate = $beginDate.val(), $endDate = $("#endDate"), endDate = $endDate.val();
    window.open("/zzhadmin/vr_recordDownload/?startTime=" + beginDate + "&endTime=" + endDate);
  },
  onClickPrevPage: function (e) {
    data.getListParams.pageNum -= 1;
    func.getList(data.getListParams, function (res) {
      func.renderList(res);
    });
  },
  onClickNextPage: function (e) {
    data.getListParams.pageNum += 1;
    func.getList(data.getListParams, function (res) {
      func.renderList(res);
    });
  }
});
