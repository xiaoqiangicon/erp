/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'underscore',
  'toastr',
  'common/variables',
  'common/function',
  'common/tpl',
  './data',
  './tpl',
  './ajax',
], function($, _, toastr, commonVars, commonFunc, commonTpl, data, tpl) {
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 2000;

  var func = {};

  var $seatContent = $('#seat-content');
  var $contentShowPrices = $('#content-show-prices');
  var $contentPricesBody = $('#content-prices-body');

  // 初始化操作
  func.init = function() {
    $contentPricesBody.append(tpl.priceRow.render({ index: 0 }));
    // 请求详细信息
    $.seeAjax.post(
      'detail',
      { id: parseInt(commonVars.params.id) },
      function(res) {
        if (res.success) {
          $('#region-name').text(res.data.name);
          data.regionName = res.data.name;
          $('#seats-popup-input').val(res.data.seats.join('\n'));
          data.rows = res.data.rows;
          data.columns = res.data.columns;

          func.renderRegion(res);

          func.renderPrices(res);
        } else {
          toastr.error('获取信息失败，请稍后重试');
        }
      },
      !0
    );
  };

  // 渲染一个区域
  func.renderRegion = function(res) {
    var rows = res.data.seats.length,
      columns = res.data.seats[0].split('|').length;

    var i, il, j, jl;
    var rowItems = [];

    // 填充空白数据
    for (i = 0, il = rows; i <= il; i++) {
      rowItems[i] = [];
      for (j = 0, jl = columns; j <= jl; j++) {
        rowItems[i][j] = {
          available: 1,
          disabled: 0,
        };
      }
    }
    // 禁用的位置
    res.data.seats.map(function(rowItem, rowIndex) {
      var rowItemArray = rowItem.split('|');
      rowItemArray.map(function(columnItem, columnIndex) {
        // 下划线表示禁用
        if (columnItem == '_') {
          rowItems[rowIndex + 1][columnIndex + 1]['disabled'] = 1;
          rowItems[rowIndex + 1][columnIndex + 1]['available'] = 0;
        }
        rowItems[rowIndex + 1][columnIndex + 1]['sequence'] = columnItem;
      });
    });

    // 渲染数据
    $seatContent.html(
      tpl.detail.render({
        rowItems: rowItems,
      })
    );

    // 设置容器宽度
    $seatContent.css({ width: 41 * columns + 100 + 'px' });
  };

  // 渲染已有的价格
  func.renderPrices = function(res) {
    if (!res.data.priceList || !res.data.priceList.length) return;

    // 左下角价格显示
    res.data.priceList.map(function(item) {
      item.prices.map(function(price) {
        price.typeText = data.priceTypeTexts[price.type];
      });
      $contentShowPrices.append(tpl.priceShowRow.render(item));

      // 渲染到位置上
      item.seatList &&
        item.seatList.length &&
        item.seatList.map(function(pos) {
          var posArray = pos.split('_'),
            posX = parseInt(posArray[0]),
            posY = parseInt(posArray[1]);

          $(
            '[data-detail-cell][data-row-index="' +
              posX +
              '"][data-column-index="' +
              posY +
              '"]'
          ).attr({ 'data-type': item.id });
        });

      // 存储到价格集合中
      data.priceData[item.id] = item.prices;
    });
  };

  // 渲染已有的价格
  func.renderShowPrices = function() {
    // 移除原有的
    $('[data-price-show-row]').remove();
    // 渲染新的
    Object.keys(data.priceData).map(function(key) {
      $contentShowPrices.append(
        tpl.priceShowRow.render({
          id: parseInt(key),
          prices: data.priceData[key],
        })
      );
    });
  };

  return func;
});
