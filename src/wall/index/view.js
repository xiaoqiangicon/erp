/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'toastr',
  'common/function',
  'common/variables',
  './data',
  './tpl',
  './function',
  '@zzh/promotion',
  './ajax',
  'lib/jquery.seeView',
], function($, toastr, commonFunc, commonVars, data, tpl, func, promotion) {
  toastr.options.positionClass = 'toast-bottom-full-width';
  toastr.options.timeOut = 2000;

  $.seeView({
    events: {
      // 点击全部推广
      '!click #action-promotion': 'onClickActionPromotion',
      // 点击添加
      '!click #action-add': 'onClickActionAdd',
      // 点击关闭弹窗
      'click [data-popup-close]': 'onClickPopupClose',
      // 点击模板单元格
      'click [data-template-cell]': 'onClickTemplateCell',
      // 点击确定选择某个模板
      '!click #select-modal-ok': 'onClickSelectModalOk',
      // 鼠标进入，显示区域弹框
      'mouseenter [data-unit-region]': 'onMouseEnterUnitRegion',
      // 鼠标离开，隐藏区域弹框
      'mouseout [data-unit-region]': 'onMouseOutUnitRegion',
      // 删除一个项目
      'click [data-unit-delete]': 'onClickUnitDelete',
      // 点击复制
      'click [data-unit-copy]': 'onClickUnitCopy',
      // 点击编辑
      'click [data-unit-edit]': 'onClickUnitEdit',
      // 点击推广
      'click [data-unit-promote]': 'onClickUnitPromote',
      // 点击更新排序
      'click [data-unit-sort]': 'onClickUnitSort',
      // 点击更新排序
      '!click #sort-popup-ok': 'onClickSortPopupOk',
    },
    // 点击全部推广
    onClickActionPromotion: function(e) {
      $.seeAjax.get('promotionUrl', {}, function(res) {
        if (res.success) {
          promotion.show({
            title: '预览',
            link: res.url,
          });
        } else {
          toastr.error('获取信息失败，请稍后再试');
        }
      });
    },
    // 点击添加
    onClickActionAdd: function(e) {
      var $body = $('body'),
        $modal = $('#select-modal'),
        $modalContent = $('#select-modal-content');
      // 已经渲染过
      if ($('[data-template-cell]').length) {
        $modal.show();
        $body.addClass('overflow-hidden');
      }
      // 请求数据渲染之后再显示
      else {
        $.seeAjax.get('templates', {}, function(res) {
          if (res.success) {
            $modalContent.append(
              tpl.templateCell.render(data.customTemplateData)
            );
            res.data &&
              res.data.length &&
              res.data.map(function(item) {
                $modalContent.append(tpl.templateCell.render(item));
              });
            $modal.show();
            $body.addClass('overflow-hidden');
          } else {
            toastr.error('获取失败，请稍后再试');
          }
        });
      }
    },
    // 点击关闭弹窗
    onClickPopupClose: function(e) {
      $(e.target)
        .parents('.modal')
        .hide();
      $('body').removeClass('overflow-hidden');
    },
    // 点击模板单元格
    onClickTemplateCell: function(e) {
      var $this = $(e.currentTarget);

      $('[data-template-cell].active').removeClass('active');
      $this.addClass('active');
    },
    // 点击确定选择某个模板
    onClickSelectModalOk: function(e) {
      var $selected = $('[data-template-cell].active');
      if (!$selected.length) {
        toastr.warning('请选择一个模板');
        return;
      }

      var id = parseInt($selected.attr('data-template-cell'));

      location.href =
        '/zzhadmin/createBuddhaIndex/' + (id ? '?templateId=' + id : '');
    },
    // 鼠标进如，显示区域弹框
    onMouseEnterUnitRegion: function(e) {
      var $this = $(e.target),
        pageX = e.pageX,
        pageY = e.pageY,
        $hoverBody = $('#hover-popup-body'),
        regions = $this.attr('data-regions').split(',');

      $hoverBody.html('');
      regions.map(function(item) {
        $hoverBody.append(tpl.hoverRow.render({ name: item }));
      });

      var $hover = $('#hover-popup'),
        hoverWidth = $hover.width(),
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
    onMouseOutUnitRegion: function() {
      $('#hover-popup')
        .stop(!0)
        .fadeOut();
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
      var $this = $(e.target),
        id = parseInt($this.attr('data-unit-copy'));

      location.href = '/zzhadmin/createBuddhaIndex/?edit=0&id=' + id;
    },
    // 点击编辑
    onClickUnitEdit: function(e) {
      var $this = $(e.target),
        id = parseInt($this.attr('data-unit-edit'));

      location.href = '/zzhadmin/createBuddhaIndex/?edit=1&id=' + id;
    },
    // 点击推广
    onClickUnitPromote: function(e) {
      promotion.show({
        title: '预览',
        link: $(e.target).attr('data-url'),
      });
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
  });
});
