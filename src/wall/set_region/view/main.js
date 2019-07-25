/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'underscore',
  'toastr',
  'common/function',
  'common/variables',
  '../data',
  '../tpl',
  '../function',
  '../ajax',
  'lib/jquery.seeView',
], function($, _, toastr, commonFunc, commonVars, data, tpl, func) {
  var $contentPrices = $('#content-prices');
  var $contentPricesBody = $('#content-prices-body');

  $.seeView({
    events: {
      // 点击添加价格
      '!click #add-price': 'onClickAddPrice',
      // 点击确认基础价格
      '!click #base-price-popup-ok': 'onClickBasePricePopupOk',
      // 点击应用价格到位置上
      '!click #apply-price': 'onClickApplyPrice',
      // 点击取消
      '!click #action-cancel': 'onClickActionCancel',
      // 点击保存
      '!click #action-save': 'onClickActionSave',
      // 点击关闭弹窗
      'click [data-popup-close]': 'onClickPopupClose',
      // 点击修改
      '!click #action-edit': 'onClickActionEdit',
      // 点击确定保存位置信息
      '!click #seats-popup-ok': 'onClickSeatsPopupOk',
    },
    // 点击添加价格
    onClickAddPrice: function(e) {
      $contentPricesBody.append(
        tpl.priceRow.render({ index: $('[data-price-row]').length })
      );
    },
    // 点击确认基础价格
    onClickBasePricePopupOk: function(e) {
      var value = parseFloat($('#base-price-popup-input').val());

      if (!value || value <= 0) {
        toastr.error('基础价格不能为空或者小于零，请重新设置');
        return;
      }

      $('[data-price-row-set="' + data.currentBasePriceSetIndex + '"]').attr({
        'data-value': value,
      });
      $('#base-price-popup').hide();
      $('body').removeClass('overflow-hidden');
    },
    // 点击应用价格到位置上
    onClickApplyPrice: function(e) {
      var $activeCells = $('[data-detail-cell="1"].active');
      if (!$activeCells.length) {
        commonFunc.dialog('没有选中有效的单元格，请先选择');
        return;
      }

      var self = this;

      var prices = self.getEditPrices();
      if (!prices) return;

      var id = self.addEditPrice(prices);
      if (!id) return;

      $activeCells.attr({ 'data-type': id });

      self.checkUnUsedPrices();

      func.renderShowPrices();

      self.afterBindPrices();
    },
    // 获取正在编辑的价格
    getEditPrices: function() {
      var $rows = $('[data-price-row]'),
        $types = $('[data-price-row-type]'),
        $prices = $('[data-price-row-price]'),
        $basePrices = $('[data-price-row-set]');
      var $type, $price, $basePrice;
      var type, price, basePrice;
      var i,
        il,
        prices = [];
      var duplicateTypesRecord = {};
      for (i = 0, il = $rows.length; i < il; i++) {
        $type = $($types[i]);
        type = parseInt($type.val());
        if (duplicateTypesRecord[type]) {
          commonFunc.dialog('有重复的供奉类型，请先去掉重复的数据之后再绑定');
          return;
        }

        $price = $($prices[i]);
        price = parseFloat($price.val());
        if (!price || price <= 0) {
          commonFunc.dialog('价格必须大于零，请检查后再绑定');
          return;
        }

        $basePrice = $($basePrices[i]);
        basePrice = parseFloat($basePrice.attr('data-value')) || 0;

        prices.push({
          type: type,
          typeText: data.priceTypeTexts[type],
          price: price,
          basePrice: basePrice,
        });
        duplicateTypesRecord[type] = !0;
      }

      return prices;
    },
    // 添加一个正在编辑的价格
    addEditPrice: function(prices) {
      var i, il, id;

      // 类型为 1-10
      for (i = 1, il = 11; i < il; i++) {
        if (!data.priceData[i]) {
          id = i;
          break;
        }
      }

      if (!id) {
        commonFunc.dialog('你添加的价格类型超过了10种，系统无法处理，请删减');
        return;
      }

      data.priceData[id] = prices;
      return id;
    },
    // 去除没有用的价格类型（从数据集合中）
    checkUnUsedPrices: function() {
      Object.keys(data.priceData).map(function(key) {
        var id = parseInt(key);

        !$('[data-detail-cell="1"][data-type="' + id + '"]').length &&
          delete data.priceData[key];
      });
    },
    // 绑定价格成功
    afterBindPrices: function() {
      $('[data-price-row]').map(function(index) {
        var $row = $(this);

        if (index > 0) $row.remove();
        else {
          // 6是默认值，按天供养
          $row.find('[data-price-row-type]').val(6);
          $row.find('[data-price-row-price]').val('');
          $row.find('[data-price-row-set]').attr({ 'data-value': '' });
        }
      });

      toastr.success('绑定成功');
    },
    // 点击取消
    onClickActionCancel: function(e) {
      commonFunc.confirm('你确定离开吗?（未保存的修改将不生效）', function() {
        history.back();
      });
    },
    // 点击保存
    onClickActionSave: function(e) {
      var $this = $('#action-save'),
        handling =
          $this.attr('data-handling') &&
          !!parseInt($this.attr('data-handling'));

      if (handling) return;

      var priceList = [];

      Object.keys(data.priceData).map(function(key) {
        var id = parseInt(key);
        var item = {
          id: id,
          prices: data.priceData[key],
          seatList: [],
        };

        $('[data-detail-cell="1"][data-type="' + id + '"]').map(function() {
          var $this = $(this),
            row = parseInt($this.attr('data-row-index')),
            column = parseInt($this.attr('data-column-index'));

          item.seatList.push(row + '_' + column);
        });

        priceList.push(item);
      });

      $this.attr({ 'data-handling': 1 }).text('保存中...');
      $.seeAjax.post(
        'save',
        {
          id: parseInt(commonVars.params.id),
          priceList: priceList,
        },
        function(res) {
          $this.attr({ 'data-handling': 0 }).text('保存设置');

          if (res.success) {
            location.href = '/zzhadmin/buddhaRegion/';
          } else {
            toastr.error('保存设置失败，请稍后再试');
          }
        },
        !0
      );
    },
    // 点击关闭弹窗
    onClickPopupClose: function(e) {
      $(e.target)
        .parents('.modal')
        .hide();
      $('body').removeClass('overflow-hidden');
    },
    // 点击修改
    onClickActionEdit: function(e) {
      $('#seats-popup').show();
      $('body').addClass('overflow-hidden');
    },
    // 点击确定保存位置信息
    onClickSeatsPopupOk: function(e) {
      var self = this,
        $this = $('#seats-popup-ok'),
        handling =
          $this.attr('data-handling') &&
          !!parseInt($this.attr('data-handling'));

      if (handling) return;

      var codeCheckResult = this.checkCreateCode(data.rows, data.columns);
      if (!codeCheckResult.success) {
        commonFunc.dialog(codeCheckResult.message);
        return;
      }

      $this.attr({ 'data-handling': 1 }).text('保存中...');
      $.seeAjax.post(
        'editSeats',
        {
          id: parseInt(commonVars.params.id),
          seats: codeCheckResult.data,
        },
        function(res) {
          $this.attr({ 'data-handling': 0 }).text('确定');

          if (res.success) {
            self.renderRegion(codeCheckResult.data);
            $('body').removeClass('overflow-hidden');
            $('#seats-popup').hide();
          } else {
            toastr.error('保存失败，请稍后重试');
          }
        },
        !0
      );
    },
    // 检查创建的位置信息码
    checkCreateCode: function(rows, columns) {
      var code = $('#seats-popup-input').val();

      if (!code) return { success: !1, message: '编号不能为空' };

      var codeRows = code.split('\n');

      if (codeRows.length != rows)
        return {
          success: !1,
          message: '行数不对，请确保行数为 ' + rows + ' 行',
        };

      var i,
        il,
        rowItem, // 一行的文本数据
        rowItemArray, // 一行的数组数据（用 | 分隔）
        emptyIndex = -1, // 空字符串的索引
        allArray = []; // rowItemArray的数组容器
      for (i = 0, il = rows; i < il; i++) {
        rowItem = codeRows[i];
        rowItemArray = rowItem.split('|');
        if (rowItemArray.length != columns)
          return {
            success: !1,
            message:
              '第 ' + (i + 1) + ' 行列数不对，请确保列数为 ' + columns + ' 列',
          };

        emptyIndex = rowItemArray.indexOf('');
        if (emptyIndex > -1)
          return {
            success: !1,
            message:
              '第 ' +
              (i + 1) +
              ' 行 ' +
              (emptyIndex + 1) +
              ' 列数据为空，请修正',
          };

        allArray.push(rowItemArray);
      }

      var flattenArray = _.without(_.flatten(allArray), '_');
      if (_.uniq(flattenArray).length != flattenArray.length)
        return { success: !1, message: '有重复编码，请修正' };

      return { success: !0, data: codeRows };
    },
    // 渲染区域
    renderRegion: function(seats) {
      seats.map(function(rowItem, rowIndex) {
        var row = rowIndex + 1;
        rowItem.split('|').map(function(columnItem, columnIndex) {
          var column = columnIndex + 1;
          var $item = $(
            '[data-detail-cell][data-row-index="' +
              row +
              '"][data-column-index="' +
              column +
              '"]'
          );

          // 不可用
          if (columnItem == '_')
            $item.removeClass('available').addClass('disabled');
          // 可用
          else $item.removeClass('disabled').addClass('available');
        });
      });
    },
  });
});
