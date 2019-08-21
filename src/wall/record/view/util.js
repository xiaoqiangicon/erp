import $ from 'jquery';
import _ from 'underscore';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
import tpl from '../tpl';
import func from '../function';
import yearHtml from '../html/year';
import monthHtml from '../html/month';
import dayHtml from '../html/day';
import '../ajax';
import seeView from 'see-view';
var util = {};
var $hoverPopup = $('#hover-popup');
var $hoverPopupActions = $('#hover-popup-actions');
var $body = $('body');
var $createPopup = $('#create-modal');
util.requestCellData = function(row, column, online, callback) {
  if (online) {
    $.seeAjax.get(
      'onlineCellInfo',
      {
        id: data.currentRegionId,
        row: row,
        column: column,
      },
      function(res) {
        if (res.success) {
          data.cellData[data.currentRegionId][
            func.getRowColumnKey(row, column)
          ] = res.data;
          callback && callback();
        } else {
          toastr.error('获取详细信息失败，请稍后再试');
        }
      }
    );
  } else {
    $.seeAjax.post(
      'cellInfo',
      {
        id: data.currentRegionId,
        row: row,
        column: column,
      },
      function(res) {
        if (res.success) {
          data.cellData[data.currentRegionId][
            func.getRowColumnKey(row, column)
          ] = res.data;
          callback && callback();
        } else {
          toastr.error('获取详细信息失败，请稍后再试');
        }
      },
      !0
    );
  }
};
util.hideHoverPopup = function() {
  $hoverPopup.stop(!0).fadeOut();
};
util.resetHoverPopup = function() {
  $('[data-detail-cell].active').removeClass('active');
  data.currentSequence = '';
  data.currentRow = 0;
  data.currentColumn = 0;
  $('#action-record').text('录入数据');
  data.currentActionIsAdd = !0;
  data.hoverPopupFreezing = !1;
  $hoverPopupActions.addClass('hide');
};
util.showCreatePopup = function() {
  $body.addClass('overflow-hidden');
  $createPopup.show().scrollTop(0);
};
util.hideCreatePopup = function() {
  $body.removeClass('overflow-hidden');
  $createPopup.hide();
};
util.fillCreatePopup = function(onlyFillSequence) {
  var regionData = data.regions[data.currentRegionId];
  var cellData;
  if (data.currentRow && data.currentColumn) {
    cellData =
      data.cellData[data.currentRegionId][
        func.getRowColumnKey(data.currentRow, data.currentColumn)
      ];
  }
  $('#create-modal-row').text(data.currentRow);
  $('#create-modal-column').text(data.currentColumn);
  $('#create-modal-sequence').val(data.currentSequence);
  if (data.currentEditIsOnline && onlyFillSequence) return;
  $('#create-modal-time')
    .val((cellData && cellData.endTime) || '')
    .prop({
      disabled: !!data.currentEditIsOnline,
    });
  var $forever = $('#create-modal-forever');
  if (data.currentEditIsOnline) $forever.addClass('hide');
  else $forever.removeClass('hide');
  $('#create-modal-name').val((cellData && cellData.writeName) || '');
  $('#create-modal-yang-shang-ren').val(
    (cellData && cellData.yangShangRen) || ''
  );
  $('#create-modal-wang-sheng-zhe').val(
    (cellData && cellData.wangShengZhe) || ''
  );
  $('#create-modal-wish').val((cellData && cellData.wish) || '');
  var $rowName = $('#create-modal-row-name');
  regionData.memoConfigTypes.indexOf(1) > -1
    ? $rowName.show()
    : $rowName.hide();
  var $rowYangShangRen = $('#create-modal-row-yang-shang-ren');
  regionData.memoConfigTypes.indexOf(6) > -1
    ? $rowYangShangRen.show()
    : $rowYangShangRen.hide();
  var $rowWangShengZhe = $('#create-modal-row-wang-sheng-zhe');
  regionData.memoConfigTypes.indexOf(7) > -1
    ? $rowWangShengZhe.show()
    : $rowWangShengZhe.hide();
  var $rowWish = $('#create-modal-row-wish');
  regionData.memoConfigTypes.indexOf(2) > -1
    ? $rowWish.show()
    : $rowWish.hide();
  $('[data-create-contact-unit]').map(function(index) {
    index > 0 && $(this).remove();
  });
  if (cellData && cellData.contactList && cellData.contactList.length) {
    if (cellData.contactList.length > 1) {
      $('#create-modal-contact').append(tpl.contact.render(cellData));
    }
    var $contactName = $('[data-create-contact-name]');
    var $contactPhone = $('[data-create-contact-phone]');
    var $contactBirthDate = $('[data-create-contact-birth-date]');
    var $contactLunarYear = $('[data-create-contact-lunar-year]');
    var $contactLunarMonth = $('[data-create-contact-lunar-month]');
    var $contactLunarDay = $('[data-create-contact-lunar-day]');
    var $contactLunar = $('[data-create-contact-lunar]');
    cellData.contactList.map(function(item, index) {
      if (index > 0) {
        $($contactBirthDate[index]).datepicker({
          format: 'yyyy-mm-dd',
          language: 'zh-CN',
          autoclose: true,
          forceParse: !1,
        });
        $($contactLunarYear[index]).html(yearHtml);
        $($contactLunarMonth[index]).html(monthHtml);
        $($contactLunarDay[index]).html(dayHtml);
      }
      $($contactName[index]).val(item.name);
      $($contactPhone[index]).val(item.phone);
      if (!item.lunar) {
        $($contactBirthDate[index])
          .val(item.birth || '')
          .show();
        $($contactLunarYear[index])
          .val(0)
          .hide();
        $($contactLunarMonth[index])
          .val(0)
          .hide();
        $($contactLunarDay[index])
          .val(0)
          .hide();
        $($contactLunar[index]).prop({
          checked: !1,
        });
      } else {
        $($contactBirthDate[index])
          .val('')
          .hide();
        $($contactLunarYear[index])
          .val(item.year || 0)
          .show();
        $($contactLunarMonth[index])
          .val(item.month || 0)
          .show();
        $($contactLunarDay[index])
          .val(item.day || 0)
          .show();
        $($contactLunar[index]).prop({
          checked: !0,
        });
      }
    });
  } else {
    $('[data-create-contact-name]').val('');
    $('[data-create-contact-phone]').val('');
    $('[data-create-contact-birth-date]')
      .val('')
      .show();
    $('[data-create-contact-lunar-year]')
      .val(0)
      .hide();
    $('[data-create-contact-lunar-month]')
      .val(0)
      .hide();
    $('[data-create-contact-lunar-day]')
      .val(0)
      .hide();
    $('[data-create-contact-lunar]').prop({
      checked: !1,
    });
  }
  if (regionData.memoConfigTypes.indexOf(5) > -1) {
    $('[data-create-contact-birth]').show();
  } else {
    $('[data-create-contact-birth]').hide();
  }
};
export default util;
