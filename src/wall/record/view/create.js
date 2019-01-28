/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'underscore',
  'toastr',
  'common/function',
  'common/variables',
  'common/data',
  '../data',
  '../tpl',
  '../function',
  './util',
  'common/util/date',
  '../html/year',
  '../html/month',
  '../html/day',
  '../ajax',
  'lib/jquery.seeView',
], function(
  $,
  _,
  toastr,
  commonFunc,
  commonVars,
  commonData,
  data,
  tpl,
  func,
  util,
  dateUtil,
  yearHtml,
  monthHtml,
  dayHtml
) {
  // 获取焦点之前的编号
  var sequenceBeforeFocus;
  var $sequence = $('#create-modal-sequence');
  var $actionRecord = $('#action-record');

  // 是否保存的是一个过期的日期
  var saveWithOutOfDate = !1;

  $.seeView({
    events: {
      // 点击删除联系人
      'click [data-create-contact-delete]': 'onClickCreateContactDelete',
      // 点击添加联系人
      '!click #create-modal-add-contact': 'onClickCreateModalAddContact',
      // 点击确定添加数据
      '!click #create-modal-ok': 'onClickCreateModalOk',
      // 获取焦点
      '!focus #create-modal-sequence': 'onFocusCreateModalSequence',
      // 失去焦点
      '!blur #create-modal-sequence': 'onBlurCreateModalSequence',
      // 切换公历与农历
      'change [data-create-contact-lunar]': 'onChangeCreateContactLunar',
      // 点击设为永久
      'click #create-modal-forever': 'onClickCreateModalForever',
    },
    // 点击删除联系人
    onClickCreateContactDelete: function(e) {
      commonFunc.confirm('确认删除吗', function() {
        $(e.target)
          .parents('[data-create-contact-unit]')
          .remove();
      });
    },
    // 点击添加联系人
    onClickCreateModalAddContact: function(e) {
      var $unit = $(tpl.contactUnit);
      $('#create-modal-contact').append($unit);

      var regionData = data.regions[data.currentRegionId];

      // 出生日期
      if (regionData.memoConfigTypes.indexOf(5) > -1) {
        $('[data-create-contact-birth]').show();
      } else {
        $('[data-create-contact-birth]').hide();
      }

      $unit.find('[data-create-contact-birth-date]').datepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        autoclose: true,
        forceParse: !1,
      });

      $unit.find('[data-create-contact-lunar-year]').html(yearHtml);
      $unit.find('[data-create-contact-lunar-month]').html(monthHtml);
      $unit.find('[data-create-contact-lunar-day]').html(dayHtml);
    },
    // 点击确定添加数据
    onClickCreateModalOk: function(e) {
      var self = this;
      var regionData = data.regions[data.currentRegionId];

      // 这个值用来确认 行和列
      var sequence = $('#create-modal-sequence').val();
      if (!sequence) {
        toastr.warning('编号信息不能为空');
        return;
      }

      // 更新线上订单：验证位置是否可用
      if (data.currentEditIsOnline) {
        var index = data.seatsArray[data.currentRegionId].indexOf(sequence);
        if (index < 0) {
          commonFunc.dialog(
            '不存在编号为 ' + sequence + ' 的位置信息，请检查后重新输入'
          );
          return;
        }

        var $detailCell = $(
          '[data-detail-cell][data-sequence="' + sequence + '"]'
        );
        var disabled = parseInt($detailCell.attr('data-disabled'));
        var online = parseInt($detailCell.attr('data-online'));
        var recorded = parseInt($detailCell.attr('data-recorded'));

        if (disabled) {
          commonFunc.dialog('编号为 ' + sequence + ' 的位置不可用，请重新输入');
          return;
        }
        if (recorded) {
          commonFunc.dialog(
            '编号为 ' + sequence + ' 的位置属于已录入数据，请重新输入'
          );
          return;
        }
        if (
          online &&
          (data.currentRow != data.lastOnlineRow ||
            data.currentColumn != data.lastOnlineColumn)
        ) {
          commonFunc.dialog(
            '编号为 ' + sequence + ' 的位置属于线上订单，不能更改，请重新输入'
          );
          return;
        }
      }

      if (!data.currentRow) {
        toastr.warning('当前位置编号没有对应的行，请确认后再操作');
        return;
      }
      if (!data.currentColumn) {
        toastr.warning('当前位置编号没有对应的列，请确认后再操作');
        return;
      }

      var endTime = $('#create-modal-time').val();
      var endTimeIsEmpty = !1;
      if (!endTime) {
        endTime = commonData.defaultEndTime;
        endTimeIsEmpty = !0;
      } else if (!dateUtil.isValidDate(endTime)) {
        toastr.warning('到期时间格式不对，请重新输入');
        return;
      }
      // 如果输入的结束时间小于或等于今天的日期，则会立马过期
      saveWithOutOfDate =
        dateUtil.getNumberOfDate(endTime) <=
        dateUtil.getNumberOfDate(commonVars.today.display);

      var writeName = $('#create-modal-name').val();
      if (!writeName && regionData.memoConfigTypes.indexOf(1) > -1) {
        toastr.warning('功德芳名不能为空');
        return;
      }
      var yangShangRen = $('#create-modal-yang-shang-ren').val();
      if (!yangShangRen && regionData.memoConfigTypes.indexOf(6) > -1) {
        toastr.warning('阳上人不能为空');
        return;
      }
      var wangShengZhe = $('#create-modal-wang-sheng-zhe').val();
      if (!wangShengZhe && regionData.memoConfigTypes.indexOf(7) > -1) {
        toastr.warning('往生者不能为空');
        return;
      }

      var contactList = [];
      var $contactNames = $('[data-create-contact-name]');
      var $contactPhones = $('[data-create-contact-phone]');
      var $contactLunar = $('[data-create-contact-lunar]');
      var $contactBirthDate = $('[data-create-contact-birth-date]');
      var $contactLunarYear = $('[data-create-contact-lunar-year]');
      var $contactLunarMonth = $('[data-create-contact-lunar-month]');
      var $contactLunarDay = $('[data-create-contact-lunar-day]');
      $contactNames.map(function(index) {
        var item = {
          name: $(this).val(),
          phone: $($contactPhones[index]).val(),
        };

        // 有出生日期
        if (regionData.memoConfigTypes.indexOf(5) > -1) {
          item.lunar = $($contactLunar[index]).prop('checked') ? 1 : 0;
          item.birth = $($contactBirthDate[index]).val();
          item.year = parseInt($($contactLunarYear[index]).val());
          item.month = parseInt($($contactLunarMonth[index]).val());
          item.day = parseInt($($contactLunarDay[index]).val());
        }
        contactList.push(item);
      });

      var params = {
        regionId: data.currentRegionId,
        row: data.currentRow,
        column: data.currentColumn,
        endTime: endTime,
        writeName: writeName,
        contactList: contactList,
        yangShangRen: yangShangRen,
        wangShengZhe: wangShengZhe,
        wish: $('#create-modal-wish').val(),
      };

      if (endTimeIsEmpty) {
        commonFunc.confirm(
          '您尚未设置过期时间，点击确定，则默认过期时间为 ' +
            commonData.defaultEndTime +
            '；点击取消，重新输入过期时间',
          function() {
            self.onSaveData(params);
          }
        );
      } else {
        self.onSaveData(params);
      }
    },
    // 保存数据
    onSaveData: function(params) {
      var self = this;
      // 添加
      if (data.currentActionIsAdd) {
        $.seeAjax.post(
          'add',
          params,
          function(res) {
            if (res.success) {
              $(
                '[data-detail-cell][data-sequence="' +
                  data.currentSequence +
                  '"]'
              )
                .attr({
                  'data-recorded': 1,
                  'data-available': 0,
                })
                .removeClass('available')
                .addClass('recorded');
              data.currentActionIsAdd = !1;
              $actionRecord.text('修改数据');
              self.onSaveDataSuccess();
              toastr.success('添加信息成功');
            } else {
              toastr.error('添加信息失败，请稍后再试');
            }
          },
          !0
        );
      }
      // 更新
      else {
        if (!data.currentEditIsOnline)
          params.id =
            data.cellData[data.currentRegionId][
              func.getRowColumnKey(data.currentRow, data.currentColumn)
            ].id;
        else
          params.id =
            data.cellData[data.currentRegionId][
              func.getRowColumnKey(data.lastOnlineRow, data.lastOnlineColumn)
            ].id;

        $.seeAjax.post(
          data.currentEditIsOnline ? 'editOnline' : 'edit',
          params,
          function(res) {
            if (res.success) {
              // 删除单元数据
              delete data.cellData[data.currentRegionId][
                func.getRowColumnKey(data.currentRow, data.currentColumn)
              ];
              self.onSaveDataSuccess();
              toastr.success('更新信息成功');
            } else {
              toastr.error('更新信息失败，请稍后再试');
            }
          },
          !0
        );
      }
    },
    // 保存数据成功
    onSaveDataSuccess: function() {
      var self = this;

      // 删除当前区域详细数据
      data.detailData[data.currentRegionId] &&
        delete data.detailData[data.currentRegionId];
      // 如果是保存了一个过期数据，或者更新线上数据，则刷新整个墙
      if (saveWithOutOfDate || data.currentEditIsOnline) {
        data.cellData[data.currentRegionId] &&
          delete data.cellData[data.currentRegionId];
        // 要延迟一下，不然墙的数据刷新不过来
        setTimeout(function() {
          func.requestRegion(data.currentRegionId);
        }, 500);
      } else {
        // 重新请求数据
        util.requestCellData(
          data.currentRow,
          data.currentColumn,
          data.currentEditIsOnline
        );
      }

      util.hideCreatePopup();
      util.resetHoverPopup();
      util.hideHoverPopup();
    },
    // 获取焦点
    onFocusCreateModalSequence: function(e) {
      sequenceBeforeFocus = $sequence.val();
    },
    // 失去焦点
    onBlurCreateModalSequence: function(e) {
      var sequence = $sequence.val();
      // 如果没有改变，返回
      if (sequence == sequenceBeforeFocus) return;

      if (!sequence) {
        commonFunc.dialog('编号为空，请重新输入');
        $sequence.val(sequenceBeforeFocus);
        return;
      }

      var index = data.seatsArray[data.currentRegionId].indexOf(sequence);

      if (index < 0) {
        commonFunc.dialog(
          '不存在编号为 ' + sequence + ' 的位置信息，请检查后重新输入'
        );
        $sequence.val(sequenceBeforeFocus);
        return;
      }

      var row = Math.floor(index / data.columnsArray[data.currentRegionId]) + 1;
      var column = (index % data.columnsArray[data.currentRegionId]) + 1;

      var $detailCell = $(
        '[data-detail-cell][data-sequence="' + sequence + '"]'
      );
      var disabled = parseInt($detailCell.attr('data-disabled'));
      var online = parseInt($detailCell.attr('data-online'));
      var recorded = parseInt($detailCell.attr('data-recorded'));

      if (disabled) {
        commonFunc.dialog('编号为 ' + sequence + ' 的位置不可用，请重新输入');
        $sequence.val(sequenceBeforeFocus);
        return;
      }
      if (online) {
        commonFunc.dialog(
          '编号为 ' + sequence + ' 的位置属于线上订单，不能更改，请重新输入'
        );
        $sequence.val(sequenceBeforeFocus);
        return;
      }

      data.currentSequence = sequence;
      data.currentRow = row;
      data.currentColumn = column;

      // 移动线上订单，不更改 currentActionIsAdd 的值
      !data.currentEditIsOnline && (data.currentActionIsAdd = !recorded);

      var cellData =
        data.cellData[data.currentRegionId][func.getRowColumnKey(row, column)];

      if (recorded && !cellData) {
        util.requestCellData(row, column, !1, function() {
          util.fillCreatePopup(!0);
        });
      } else {
        util.fillCreatePopup(!0);
      }
    },
    // 切换公历与农历
    onChangeCreateContactLunar: function(e) {
      var $this = $(e.target),
        lunar = $this.prop('checked');

      var $unit = $this.parents('[data-create-contact-unit]');
      var $date = $unit.find('[data-create-contact-birth-date]');
      var $year = $unit.find('[data-create-contact-lunar-year]');
      var $month = $unit.find('[data-create-contact-lunar-month]');
      var $day = $unit.find('[data-create-contact-lunar-day]');
      // 切换到农历
      if (lunar) {
        $date.hide();
        $year.show();
        $month.show();
        $day.show();
      } else {
        $date.show();
        $year.hide();
        $month.hide();
        $day.hide();
      }
    },
    // 点击设为永久
    onClickCreateModalForever: function(e) {
      !data.currentEditIsOnline &&
        $('#create-modal-time').val(commonData.defaultEndTime);
    },
  });
});
