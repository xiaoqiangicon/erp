import $ from 'jquery';
import _ from 'underscore';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
import tpl from '../tpl';
import func from '../function';
import '../ajax';
import 'lib/jquery.seeView';
var $contentPrices = $('#content-prices');
var $contentPricesBody = $('#content-prices-body');
$.seeView({
  events: {
    'click [data-detail-cell]': 'onClickDetailCell',
    'click [data-price-row-delete]': 'onClickPriceRowDelete',
    'click [data-price-row-set]': 'onClickPriceRowSet',
    'mouseenter [data-detail-cell]': 'onMouseEnterDetailCell',
    'mouseout [data-detail-cell]': 'onMouseOutDetailCell',
  },
  onClickDetailCell: function(e) {
    var $this = $(e.target),
      row = parseInt($this.attr('data-row-index')),
      column = parseInt($this.attr('data-column-index'));
    var $cells;
    if (row > 0 && column > 0) {
      $this.toggleClass('active');
    } else if (row > 0 && column == 0) {
      $cells = $('[data-detail-cell][data-row-index="' + row + '"]');
      if ($this.hasClass('active')) $cells.removeClass('active');
      else $cells.addClass('active');
    } else if (row == 0 && column > 0) {
      $cells = $('[data-detail-cell][data-column-index="' + column + '"]');
      if ($this.hasClass('active')) $cells.removeClass('active');
      else $cells.addClass('active');
    } else {
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
  checkToShowPriceEdit: function() {
    if ($('[data-detail-cell="1"].active').length) $contentPrices.show();
    else $contentPrices.hide();
  },
  onClickPriceRowDelete: function(e) {
    $(e.target)
      .parents('[data-price-row]')
      .remove();
  },
  onClickPriceRowSet: function(e) {
    var $this = $(e.target),
      index = parseInt($this.attr('data-price-row-set')),
      value = $this.attr('data-value');
    data.currentBasePriceSetIndex = index;
    $('#base-price-popup-input').val(value);
    $('#base-price-popup').show();
    $('body').addClass('overflow-hidden');
  },
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
      showOnRight = !1;
    if (pageX < data.winWidth / 2) {
      hoverX = pageX + 60;
      showOnRight = !0;
    } else {
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
  onMouseOutDetailCell: function() {
    $('#hover-popup')
      .stop(!0)
      .fadeOut();
  },
});
