/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'underscore',
  'toastr',
  'common/function',
  'common/variables',
  './data',
  './tpl',
  './function',
  './ajax',
  'lib/jquery.seeView',
], function($, _, toastr, commonFunc, commonVars, data, tpl, func) {
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 2000;

  $.seeView({
    events: {
      // 过滤
      '!change [data-filter]': 'onChangeFilter',
      // 点击添加
      '!click #action-add': 'onClickActionAdd',
      // 点击关闭弹窗
      'click [data-popup-close]': 'onClickPopupClose',
      // 删除一个项目
      'click [data-unit-delete]': 'onClickUnitDelete',
      // 点击复制
      'click [data-unit-copy]': 'onClickUnitCopy',
      // 点击编辑
      'click [data-unit-edit]': 'onClickUnitEdit',
      // 点击冻结或激活
      'click [data-unit-freeze]': 'onClickUnitFreeze',
      // 点击更新排序
      'click [data-unit-sort]': 'onClickUnitSort',
      // 点击更新排序
      '!click #sort-popup-ok': 'onClickSortPopupOk',
      // 点击确认创建
      '!click #create-popup-ok': 'onClickCreatePopupOk',
    },
    // 过滤
    onChangeFilter: function(e) {
      var $this = $(e.target),
        filterName = $this.attr('data-filter'),
        value = $this.val();

      // buddha
      if (filterName === 'buddha') {
        value = parseInt(value);
      }
      // place
      else {
        data.filter.buddha = 0;

        var buddhaList = data.placeData[value];
        var $container2 = $('[data-filter-container="2"]');
        var $buddhaFilter = $('[data-filter="buddha"]');
        // 无buddha列表
        if (!buddhaList || !buddhaList.length) {
          $container2.addClass('hide');
        } else {
          $container2.removeClass('hide');
          $buddhaFilter.html(tpl.option.render({ id: 0, name: '全部' }));
          buddhaList.map(function(item) {
            $buddhaFilter.append(tpl.option.render(item));
          });
          $buddhaFilter.val(0);
        }
      }

      data.filter[filterName] = value;

      func.requestList();
    },
    // 点击添加
    onClickActionAdd: function(e) {
      this.resetCreatePopup();
      $('#create-popup')
        .show()
        .scrollTop(0);
      $('body').addClass('overflow-hidden');

      data.currentCopyId = 0;
    },
    resetCreatePopup: function() {
      $('#create-popup-name').val('');
      $('#create-popup-rows').val('');
      $('#create-popup-columns').val('');
      //$('#create-popup-code').val('');
    },
    // 点击关闭弹窗
    onClickPopupClose: function(e) {
      $(e.target)
        .parents('.modal')
        .hide();
      $('body').removeClass('overflow-hidden');
    },
    // 删除一个项目
    onClickUnitDelete: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-unit-delete'));

      commonFunc.confirm('确定删除这个项目吗', function() {
        $.seeAjax.post(
          'delete',
          { id: id },
          function(res) {
            if (res.success) {
              $('[data-unit="' + id + '"]').remove();
              toastr.success('删除成功');
            } else {
              toastr.error('删除失败，请稍后再试');
            }
          },
          !0
        );
      });
    },
    // 点击复制
    onClickUnitCopy: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-unit-copy'));

      // 如果项目详细信息不为空，则直接渲染
      if (data.detailData[id]) {
        self.showCreatePopupForCopy(id);
      }
      // 如果项目详细信息为空，则请求数据
      else {
        $.seeAjax.post(
          'detail',
          { id: id },
          function(res) {
            if (res.success) {
              data.detailData[id] = res.data;
              self.showCreatePopupForCopy(id);
            } else {
              commonFunc.dialog('获取区域详细信息失败，请稍后再试');
            }
          },
          !0
        );
      }
    },
    // 弹出复制框
    showCreatePopupForCopy: function(id) {
      var unitData = data.listData[id];
      var detailData = data.detailData[id];
      // 存入后台的名字是 佛像名+真正的名字，中间用短横线链接
      var placeName = unitData.place,
        dashIndex = unitData.place.indexOf('-');
      dashIndex > -1 && (placeName = unitData.place.slice(dashIndex + 1));
      $('#create-popup-name').val(placeName);
      $('#create-popup-rows').val(unitData.rows);
      $('#create-popup-columns').val(unitData.columns);
      $('#create-popup-code').val(detailData.seats.join('\n'));
      $('#create-popup-type').val(detailData.buddhaId);

      $('#create-popup')
        .show()
        .scrollTop(0);
      $('body').addClass('overflow-hidden');

      data.currentCopyId = id;
    },
    // 点击编辑
    onClickUnitEdit: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-unit-edit'));

      location.href = '/zzhadmin/buddhaSetRegion/?id=' + id;
    },
    // 点击冻结或激活
    onClickUnitFreeze: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-unit-freeze')),
        status = parseInt($this.attr('data-status'));

      $.seeAjax.post(
        'freeze',
        { id: id, status: 1 - status },
        function(res) {
          if (res.success) {
            var $status = $('[data-unit-status="' + id + '"]');
            // 原本处于冻结状态
            if (status) {
              $this
                .attr({ 'data-status': 0 })
                .text('冻结')
                .removeClass('active');
              $status.text('已激活').addClass('active');
              toastr.success('激活成功');
            } else {
              $this
                .attr({ 'data-status': 1 })
                .text('激活')
                .addClass('active');
              $status.text('未激活').removeClass('active');
              toastr.success('冻结成功');
            }
          } else {
            toastr.error('操作失败，请稍后重新尝试');
          }
        },
        !0
      );
    },
    // 点击更新排序
    onClickUnitSort: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-unit-sort')),
        sequence = parseInt($this.attr('data-sequence'));

      data.currentSortId = id;

      $('#sort-popup-input').val(sequence);

      $('#sort-popup').show();
    },
    // 点击更新排序
    onClickSortPopupOk: function(e) {
      var sort = parseInt($('#sort-popup-input').val()) || 0;

      $.seeAjax.post(
        'sort',
        { id: data.currentSortId, sort: sort },
        function(res) {
          if (res.success) {
            $('#sort-popup').hide();
            func.requestList();
            toastr.success('更新成功');
          } else {
            toastr.error('更新排序失败，请稍后重试');
          }
        },
        !0
      );
    },
    // 点击确认创建
    onClickCreatePopupOk: function(e) {
      var name = $('#create-popup-name').val();
      if (!name) {
        commonFunc.dialog('区域名称不能为空');
        return;
      }

      var rows = parseInt($('#create-popup-rows').val());
      if (!rows) {
        commonFunc.dialog('行数不能为空');
        return;
      }

      var columns = parseInt($('#create-popup-columns').val());
      if (!columns) {
        commonFunc.dialog('列数不能为空');
        return;
      }

      var codeCheckResult = this.checkCreateCode(rows, columns);
      if (!codeCheckResult.success) {
        commonFunc.dialog(codeCheckResult.message);
        return;
      }

      var buddhaId = parseInt($('#create-popup-type').val());

      $.seeAjax.post(
        'create',
        {
          name: name,
          rows: rows,
          columns: columns,
          code: codeCheckResult.data,
          buddhaId: buddhaId,
          nonSeatCode:
            data.currentCopyId && data.detailData[data.currentCopyId]
              ? data.detailData[data.currentCopyId].nonSeatCode
              : '',
        },
        function(res) {
          if (res.success) {
            $('#create-popup').hide();
            $('body').removeClass('overflow-hidden');
            func.requestList();
            toastr.success('保存成功');
          } else {
            toastr.error('保存失败，请稍后重试');
          }
        },
        !0
      );
    },
    // 检查创建的位置信息码
    checkCreateCode: function(rows, columns) {
      var code = $('#create-popup-code').val();

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
  });
});
