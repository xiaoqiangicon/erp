/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'underscore',
  'common/function',
  'common/tpl',
  './data',
  './tpl',
  './html/year',
  './html/month',
  './html/day',
  './ajax',
], function(
  $,
  _,
  commonFunc,
  commonTpl,
  data,
  tpl,
  yearHtml,
  monthHtml,
  dayHtml
) {
  var func = {};

  var $contentBody = $('#content-body');

  // 初始化操作
  func.init = function() {
    // 大殿
    $.seeAjax.get('houses', {}, function(res) {
      if (res.success && res.data && res.data.length) {
        var $select = $('#select-house');
        res.data.map(function(item) {
          item.id = item.name;
          $select.append(tpl.option.render(item));
        });
      }
    });
    // 区域
    $.seeAjax.get('regions', {}, function(res) {
      if (res.success && res.data && res.data.length) {
        var $select = $('#select-region');
        res.data.map(function(item) {
          // memoConfig
          item.memoConfigTypes = [];
          item.memoConfig &&
            item.memoConfig.length &&
            item.memoConfig.map(function(memoItem) {
              item.memoConfigTypes.push(memoItem.type);
            });
          data.regions[item.id] = item;
          $select.append(tpl.regionCell.render(item));
        });
      }
    });

    // 初始化日期选择
    $('#create-modal-time').datepicker({
      format: 'yyyy-mm-dd',
      language: 'zh-CN',
      autoclose: true,
      forceParse: !1,
    });
    // 第一个出生日期选择
    $('[data-create-contact-birth-date]').datepicker({
      format: 'yyyy-mm-dd',
      language: 'zh-CN',
      autoclose: true,
      forceParse: !1,
    });
    $('[data-create-contact-lunar-year]').html(yearHtml);
    $('[data-create-contact-lunar-month]').html(monthHtml);
    $('[data-create-contact-lunar-day]').html(dayHtml);
  };

  // 请求一个区域
  func.requestRegion = function(id) {
    if (data.detailData[id]) {
      func.renderRegion(data.detailData[id]);
    } else {
      // 添加一个单元格容器
      data.cellData[id] = {};
      // 请求数据
      $.seeAjax.post(
        'detail',
        { id: id },
        function(res) {
          if (res.success) {
            data.detailData[id] = res;
            data.seatsArray[id] = [];
            func.renderRegion(res, !0, id);
          } else {
            res.message && commonFunc.alert(res.message);
          }
        },
        !0
      );
    }
  };
  // 渲染一个区域
  func.renderRegion = function(res, isFirst, id) {
    var rows = res.data.seats.length,
      columns = res.data.seats[0].split('|').length;

    // 第一次渲染，记录行数和列数
    if (isFirst) {
      data.rowsArray[id] = rows;
      data.columnsArray[id] = columns;
    }

    var i, il, j, jl;
    var rowItems = [];

    // 填充空白数据
    for (i = 0, il = rows; i <= il; i++) {
      rowItems[i] = [];
      for (j = 0, jl = columns; j <= jl; j++) {
        rowItems[i][j] = {
          available: 1,
          recorded: 0,
          online: 0,
          disabled: 0,
        };
      }
    }
    // 位置信息
    res.data.seats.map(function(rowItem, rowIndex) {
      var rowItemArray = rowItem.split('|');
      rowItemArray.map(function(columnItem, columnIndex) {
        // 第一次渲染，记录位置数据
        isFirst && data.seatsArray[id].push(columnItem);
        // 禁用的位置，下划线表示禁用
        if (columnItem == '_') {
          rowItems[rowIndex + 1][columnIndex + 1]['disabled'] = 1;
          rowItems[rowIndex + 1][columnIndex + 1]['available'] = 0;
        }
        rowItems[rowIndex + 1][columnIndex + 1]['sequence'] = columnItem;
      });
    });
    // 已录数据
    res.data.recordSeats &&
      res.data.recordSeats.length &&
      res.data.recordSeats.map(function(pos) {
        var posArray = pos.split('_');
        rowItems[parseInt(posArray[0])][parseInt(posArray[1])]['recorded'] = 1;
        rowItems[parseInt(posArray[0])][parseInt(posArray[1])]['available'] = 0;
      });
    // 线上数据
    res.data.onlineSeats &&
      res.data.onlineSeats.length &&
      res.data.onlineSeats.map(function(pos) {
        var posArray = pos.split('_');
        rowItems[parseInt(posArray[0])][parseInt(posArray[1])]['online'] = 1;
        rowItems[parseInt(posArray[0])][parseInt(posArray[1])]['available'] = 0;
      });

    // 渲染数据
    $contentBody.html(
      tpl.detail.render({
        rowItems: rowItems,
      })
    );

    // 设置容器宽度
    $contentBody.css({ width: 41 * columns + 100 + 'px' });
  };

  // 获取行和列组成的键名
  func.getRowColumnKey = function(row, column) {
    return row + '-' + column;
  };

  return func;
});
