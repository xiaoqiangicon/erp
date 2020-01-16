import $ from 'jquery';
import _ from 'underscore';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
import tpl from '../tpl';
import func from '../function';
import util from './util';
import '../ajax';
import seeView from 'see-view';
var $hoverPopupActions = $('#hover-popup-actions');
var $actionRecord = $('#action-record');
var $hoverPopupOk = $('#hover-popup-ok');
var lastMouseEnterDetailCellEvent;
seeView({
  events: {
    'mouseenter [data-detail-cell]': 'onMouseEnterDetailCell',
    'mouseout [data-detail-cell]': 'onMouseOutDetailCell',
    'click [data-detail-cell]': 'onClickDetailCell',
  },
  onMouseEnterDetailCell: function(e, force) {
    lastMouseEnterDetailCellEvent = e;
    if (data.hoverPopupFreezing && !force) return;
    var self = this,
      $this = $(e.target),
      disabled = !!parseInt($this.attr('data-disabled')),
      available = !!parseInt($this.attr('data-available')),
      online = !!parseInt($this.attr('data-online')),
      sequence = $this.attr('data-sequence'),
      row = parseInt($this.attr('data-row-index')),
      column = parseInt($this.attr('data-column-index'));
    if (disabled) return;
    if (available) {
      self.showHoverPopup(e, {}, sequence, row, column);
    } else if (
      data.cellData[data.currentRegionId] &&
      data.cellData[data.currentRegionId][func.getRowColumnKey(row, column)]
    ) {
      self.showHoverPopup(
        e,
        data.cellData[data.currentRegionId][func.getRowColumnKey(row, column)],
        sequence,
        row,
        column
      );
    } else {
      util.requestCellData(row, column, online, function() {
        self.showHoverPopup(
          e,
          data.cellData[data.currentRegionId][
            func.getRowColumnKey(row, column)
          ],
          sequence,
          row,
          column
        );
      });
    }
  },
  showHoverPopup: function(e, cellData, sequence, row, column) {
    var $this = $(e.target),
      pageX = e.pageX,
      pageY = e.pageY,
      $hover = $('#hover-popup');
    cellData.regionName = data.regions[data.currentRegionId].name;
    cellData.sequence = sequence;
    cellData.row = row;
    cellData.column = column;
    $('#hover-popup-content').html(tpl.hover.render(cellData));
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
    if (data.hoverPopupFreezing) return;
    util.hideHoverPopup();
  },
  onClickDetailCell: function(e) {
    var self = this,
      $this = $(e.target),
      disabled = !!parseInt($this.attr('data-disabled')),
      online = !!parseInt($this.attr('data-online')),
      recorded = !!parseInt($this.attr('data-recorded')),
      row = parseInt($this.attr('data-row-index')),
      column = parseInt($this.attr('data-column-index')),
      sequence = $this.attr('data-sequence');
    if (disabled) return;
    data.currentEditIsOnline = online;
    if (!$this.hasClass('active')) {
      $('[data-detail-cell].active').removeClass('active');
      $this.addClass('active');
      data.currentSequence = sequence;
      data.currentRow = row;
      data.currentColumn = column;
      if (online) {
        data.lastOnlineRow = row;
        data.lastOnlineColumn = column;
      }
      $actionRecord.text(recorded || online ? '修改数据' : '录入数据');
      $hoverPopupOk.text(recorded || online ? '修改数据' : '录入数据');
      data.currentActionIsAdd = !recorded && !online;
      if (data.hoverPopupFreezing) {
        self.onMouseEnterDetailCell(lastMouseEnterDetailCellEvent, !0);
      }
      data.hoverPopupFreezing = !0;
      $hoverPopupActions.removeClass('hide');
      if (
        (recorded || online) &&
        !data.cellData[data.currentRegionId][func.getRowColumnKey(row, column)]
      ) {
        util.requestCellData(row, column);
      }
    } else {
      util.resetHoverPopup();
    }
  },
});
