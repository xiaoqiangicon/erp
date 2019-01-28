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
  './util',
  '../ajax',
  'lib/jquery.seeView',
], function($, _, toastr, commonFunc, commonVars, data, tpl, func, util) {
  var $hoverPopupActions = $('#hover-popup-actions');
  var $actionRecord = $('#action-record');
  var $hoverPopupOk = $('#hover-popup-ok');

  // 记录最近一次鼠标进入单元格时间，用于切换已选中单元格是，能正确定位
  var lastMouseEnterDetailCellEvent;

  $.seeView({
    events: {
      // 鼠标进入单元格
      'mouseenter [data-detail-cell]': 'onMouseEnterDetailCell',
      // 鼠标进入单元格
      'mouseout [data-detail-cell]': 'onMouseOutDetailCell',
      // 点击单元格
      'click [data-detail-cell]': 'onClickDetailCell',
    },
    // 鼠标进入单元格
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

      // 没有录入数据
      if (available) {
        self.showHoverPopup(e, {}, sequence, row, column);
      }
      // 已有数据
      else if (
        data.cellData[data.currentRegionId] &&
        data.cellData[data.currentRegionId][func.getRowColumnKey(row, column)]
      ) {
        self.showHoverPopup(
          e,
          data.cellData[data.currentRegionId][
            func.getRowColumnKey(row, column)
          ],
          sequence,
          row,
          column
        );
      }
      // 没有，则请求数据
      else {
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
    // 渲染hover弹出框
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
      if (data.hoverPopupFreezing) return;

      util.hideHoverPopup();
    },
    // 点击单元格
    onClickDetailCell: function(e) {
      var self = this,
        $this = $(e.target),
        disabled = !!parseInt($this.attr('data-disabled')),
        online = !!parseInt($this.attr('data-online')),
        recorded = !!parseInt($this.attr('data-recorded')),
        row = parseInt($this.attr('data-row-index')),
        column = parseInt($this.attr('data-column-index')),
        sequence = $this.attr('data-sequence');

      //if (disabled || online) return;
      if (disabled) return;

      data.currentEditIsOnline = online;

      // 未选中
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

        // 已处于固定状态，只是切换一个单元格而已
        if (data.hoverPopupFreezing) {
          // 正确定位
          self.onMouseEnterDetailCell(lastMouseEnterDetailCellEvent, !0);
        }

        data.hoverPopupFreezing = !0;
        $hoverPopupActions.removeClass('hide');

        // 如果已录入数据，但未获取到数据，则获取数据
        if (
          (recorded || online) &&
          !data.cellData[data.currentRegionId][
            func.getRowColumnKey(row, column)
          ]
        ) {
          util.requestCellData(row, column);
        }
      }
      // 已选中
      else {
        util.resetHoverPopup();
      }
    },
  });
});
