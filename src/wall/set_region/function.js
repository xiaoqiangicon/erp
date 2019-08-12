import $ from "jquery";
import _ from "underscore";
import toastr from "toastr";
import commonVars from "common/variables";
import commonFunc from "common/function";
import commonTpl from "common/tpl";
import data from "./data";
import tpl from "./tpl";
import "./ajax";
toastr.options.positionClass = "toast-bottom-full-width";
toastr.options.timeOut = 2000;
var func = {};
var $seatContent = $("#seat-content");
var $contentShowPrices = $("#content-show-prices");
var $contentPricesBody = $("#content-prices-body");
func.init = function () {
  $contentPricesBody.append(tpl.priceRow.render({
    index: 0
  }));
  $.seeAjax.post("detail", {
    id: parseInt(commonVars.params.id)
  }, function (res) {
    if (res.success) {
      $("#region-name").text(res.data.name);
      data.regionName = res.data.name;
      $("#seats-popup-input").val(res.data.seats.join("\n"));
      data.rows = res.data.rows;
      data.columns = res.data.columns;
      func.renderRegion(res);
      func.renderPrices(res);
    } else {
      toastr.error("获取信息失败，请稍后重试");
    }
  }, !0);
};
func.renderRegion = function (res) {
  var rows = res.data.seats.length, columns = res.data.seats[0].split("|").length;
  var i, il, j, jl;
  var rowItems = [];
  for ((i = 0, il = rows); i <= il; i++) {
    rowItems[i] = [];
    for ((j = 0, jl = columns); j <= jl; j++) {
      rowItems[i][j] = {
        available: 1,
        disabled: 0
      };
    }
  }
  res.data.seats.map(function (rowItem, rowIndex) {
    var rowItemArray = rowItem.split("|");
    rowItemArray.map(function (columnItem, columnIndex) {
      if (columnItem == "_") {
        rowItems[rowIndex + 1][columnIndex + 1]["disabled"] = 1;
        rowItems[rowIndex + 1][columnIndex + 1]["available"] = 0;
      }
      rowItems[rowIndex + 1][columnIndex + 1]["sequence"] = columnItem;
    });
  });
  $seatContent.html(tpl.detail.render({
    rowItems: rowItems
  }));
  $seatContent.css({
    width: 41 * columns + 100 + "px"
  });
};
func.renderPrices = function (res) {
  if (!res.data.priceList || !res.data.priceList.length) return;
  res.data.priceList.map(function (item) {
    item.prices.map(function (price) {
      price.typeText = data.priceTypeTexts[price.type];
    });
    $contentShowPrices.append(tpl.priceShowRow.render(item));
    item.seatList && item.seatList.length && item.seatList.map(function (pos) {
      var posArray = pos.split("_"), posX = parseInt(posArray[0]), posY = parseInt(posArray[1]);
      $("[data-detail-cell][data-row-index=\"" + posX + "\"][data-column-index=\"" + posY + "\"]").attr({
        "data-type": item.id
      });
    });
    data.priceData[item.id] = item.prices;
  });
};
func.renderShowPrices = function () {
  $("[data-price-show-row]").remove();
  Object.keys(data.priceData).map(function (key) {
    $contentShowPrices.append(tpl.priceShowRow.render({
      id: parseInt(key),
      prices: data.priceData[key]
    }));
  });
};
export default func;
