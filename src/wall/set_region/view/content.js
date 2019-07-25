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
      // 点击单元格
      'click [data-detail-cell]': 'onClickDetailCell',
      // 点击删除价格
      'click [data-price-row-delete]': 'onClickPriceRowDelete',
      // 点击设置基础价格
      'click [data-price-row-set]': 'onClickPriceRowSet',
      // 鼠标进入单元格
      'mouseenter [data-detail-cell]': 'onMouseEnterDetailCell',
      // 鼠标进入单元格
      'mouseout [data-detail-cell]': 'onMouseOutDetailCell',
    },
    // 点击单元格
    onClickDetailCell: function(e) {
      var $this = $(e.target),
        row = parseInt($this.attr('data-row-index')),
        column = parseInt($this.attr('data-column-index'));

      var $cells;

      // 正常的单元格
      if (row > 0 && column > 0) {
        $this.toggleClass('active');
      }
      // 选择某一行
      else if (row > 0 && column == 0) {
        $cells = $('[data-detail-cell][data-row-index="' + row + '"]');
        if ($this.hasClass('active')) $cells.removeClass('active');
        else $cells.addClass('active');
      }
      // 选择某一列
      else if (row == 0 && column > 0) {
        $cells = $('[data-detail-cell][data-column-index="' + column + '"]');
        if ($this.hasClass('active')) $cells.removeClass('active');
        else $cells.addClass('active');
      }
      // 选择全部
      else {
        $cells = $('[data-detail-cell]');
        if ($this.hasClass('active')) {
          $cells.removeClass('active');
          $this.text('全选');
        } else {
          $cells.addClass('active');
          $this.text('清空');
        }
      }

      this.checkToShowPriceEdit();
    },
    // 检查是否显示价格编辑区域
    checkToShowPriceEdit: function() {
      if ($('[data-detail-cell="1"].active').length) $contentPrices.show();
      else $contentPrices.hide();
    },
    // 点击删除价格
    onClickPriceRowDelete: function(e) {
      $(e.target)
        .parents('[data-price-row]')
        .remove();
    },
    // 点击设置基础价格
    onClickPriceRowSet: function(e) {
      var $this = $(e.target),
        index = parseInt($this.attr('data-price-row-set')),
        value = $this.attr('data-value');

      data.currentBasePriceSetIndex = index;

      $('#base-price-popup-input').val(value);
      $('#base-price-popup').show();
      $('body').addClass('overflow-hidden');
    },
    // 鼠标进入单元格
    onMouseEnterDetailCell: function(e) {
      var self = this,
        $this = $(e.target),
        sequence = $this.attr('data-sequence'),
        disabled = !!parseInt($this.attr('data-disabled')),
        id = parseInt($this.attr('data-type')),
        row = parseInt($this.attr('data-row-index')),
        column = parseInt($this.attr('data-column-index'));

      if (disabled || !row || !column) return;

      self.showHoverPopup(e, id, sequence, row, column);
    },
    // 渲染hover弹出框
    showHoverPopup: function(e, id, sequence, row, column) {
      var $this = $(e.target),
        pageX = e.pageX,
        pageY = e.pageY,
        $hover = $('#hover-popup');

      $hover.html(
        tpl.hover.render({
          name: data.regionName,
          sequence: sequence,
          row: row,
          column: column,
          prices: data.priceData[id],
        })
      );

      var hoverWidth = $hover.width(),
        hoverHeight = $hover.height(),
        hoverX = 0,
        hoverY = 0,
        showOnRight = !1; // 是否显示在右边
      // 显示在右边
      if (pageX < data.winWidth / 2) {
        hoverX = pageX + 60;
        showOnRight = !0;
      }
      // 显示在左边
      else {
        hoverX = data.winWidth - pageX + 60;
        showOnRight = !1;
      }
      hoverY = pageY - hoverHeight / 2;

      $hover.css({
        top: hoverY + 'px',
        left: showOnRight ? hoverX + 'px' : 'auto',
        right: !showOnRight ? hoverX + 'px' : 'auto',
      });

      $hover.stop(!0).fadeIn();
    },
    // 鼠标离开，隐藏区域弹框
    onMouseOutDetailCell: function() {
      $('#hover-popup')
        .stop(!0)
        .fadeOut();
    },
  });
});
