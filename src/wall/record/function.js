import $ from "jquery";
import _ from "underscore";
import commonFunc from "common/function";
import commonTpl from "common/tpl";
import data from "./data";
import tpl from "./tpl";
import yearHtml from "./html/year";
import monthHtml from "./html/month";
import dayHtml from "./html/day";
import "./ajax";
var func = {};
var $contentBody = $("#content-body");
func.init = function () {
  $.seeAjax.get("houses", {}, function (res) {
    if (res.success && res.data && res.data.length) {
      var $select = $("#select-house");
      res.data.map(function (item) {
        item.id = item.name;
        $select.append(tpl.option.render(item));
      });
    }
  });
  $.seeAjax.get("regions", {}, function (res) {
    if (res.success && res.data && res.data.length) {
      var $select = $("#select-region");
      res.data.map(function (item) {
        item.memoConfigTypes = [];
        item.memoConfig && item.memoConfig.length && item.memoConfig.map(function (memoItem) {
          item.memoConfigTypes.push(memoItem.type);
        });
        data.regions[item.id] = item;
        $select.append(tpl.regionCell.render(item));
      });
    }
  });
  $("#create-modal-time").datepicker({
    format: "yyyy-mm-dd",
    language: "zh-CN",
    autoclose: true,
    forceParse: !1
  });
  $("[data-create-contact-birth-date]").datepicker({
    format: "yyyy-mm-dd",
    language: "zh-CN",
    autoclose: true,
    forceParse: !1
  });
  $("[data-create-contact-lunar-year]").html(yearHtml);
  $("[data-create-contact-lunar-month]").html(monthHtml);
  $("[data-create-contact-lunar-day]").html(dayHtml);
};
func.requestRegion = function (id) {
  if (data.detailData[id]) {
    func.renderRegion(data.detailData[id]);
  } else {
    data.cellData[id] = {};
    $.seeAjax.post("detail", {
      id: id
    }, function (res) {
      if (res.success) {
        data.detailData[id] = res;
        data.seatsArray[id] = [];
        func.renderRegion(res, !0, id);
      } else {
        res.message && commonFunc.alert(res.message);
      }
    }, !0);
  }
};
func.renderRegion = function (res, isFirst, id) {
  var rows = res.data.seats.length, columns = res.data.seats[0].split("|").length;
  if (isFirst) {
    data.rowsArray[id] = rows;
    data.columnsArray[id] = columns;
  }
  var i, il, j, jl;
  var rowItems = [];
  for ((i = 0, il = rows); i <= il; i++) {
    rowItems[i] = [];
    for ((j = 0, jl = columns); j <= jl; j++) {
      rowItems[i][j] = {
        available: 1,
        recorded: 0,
        online: 0,
        disabled: 0
      };
    }
  }
  res.data.seats.map(function (rowItem, rowIndex) {
    var rowItemArray = rowItem.split("|");
    rowItemArray.map(function (columnItem, columnIndex) {
      isFirst && data.seatsArray[id].push(columnItem);
      if (columnItem == "_") {
        rowItems[rowIndex + 1][columnIndex + 1]["disabled"] = 1;
        rowItems[rowIndex + 1][columnIndex + 1]["available"] = 0;
      }
      rowItems[rowIndex + 1][columnIndex + 1]["sequence"] = columnItem;
    });
  });
  res.data.recordSeats && res.data.recordSeats.length && res.data.recordSeats.map(function (pos) {
    var posArray = pos.split("_");
    rowItems[parseInt(posArray[0])][parseInt(posArray[1])]["recorded"] = 1;
    rowItems[parseInt(posArray[0])][parseInt(posArray[1])]["available"] = 0;
  });
  res.data.onlineSeats && res.data.onlineSeats.length && res.data.onlineSeats.map(function (pos) {
    var posArray = pos.split("_");
    rowItems[parseInt(posArray[0])][parseInt(posArray[1])]["online"] = 1;
    rowItems[parseInt(posArray[0])][parseInt(posArray[1])]["available"] = 0;
  });
  $contentBody.html(tpl.detail.render({
    rowItems: rowItems
  }));
  $contentBody.css({
    width: 41 * columns + 100 + "px"
  });
};
func.getRowColumnKey = function (row, column) {
  return row + "-" + column;
};
export default func;
