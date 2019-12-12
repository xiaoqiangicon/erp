import seeAjax from 'see-ajax';
import $ from 'jquery';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from './data';
import tpl from './tpl';
import func from './function';
import promotion from '../../component/promotion';
import './ajax';
import seeView from 'see-view';
toastr.options.positionClass = 'toast-bottom-full-width';
toastr.options.timeOut = 2000;
seeView({
  events: {
    '!click #action-promotion': 'onClickActionPromotion',
    '!click #action-add': 'onClickActionAdd',
    'click [data-popup-close]': 'onClickPopupClose',
    'click [data-template-cell]': 'onClickTemplateCell',
    '!click #select-modal-ok': 'onClickSelectModalOk',
    'mouseenter [data-unit-region]': 'onMouseEnterUnitRegion',
    'mouseout [data-unit-region]': 'onMouseOutUnitRegion',
    'click [data-unit-delete]': 'onClickUnitDelete',
    'click [data-unit-copy]': 'onClickUnitCopy',
    'click [data-unit-edit]': 'onClickUnitEdit',
    'click [data-unit-promote]': 'onClickUnitPromote',
    'click [data-unit-sort]': 'onClickUnitSort',
    '!click #sort-popup-ok': 'onClickSortPopupOk',
  },
  onClickActionPromotion: function(e) {
    seeAjax('promotionUrl', {}, function(res) {
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
  onClickActionAdd: function(e) {
    var $body = $('body'),
      $modal = $('#select-modal'),
      $modalContent = $('#select-modal-content');
    if ($('[data-template-cell]').length) {
      $modal.show();
      $body.addClass('overflow-hidden');
    } else {
      seeAjax('templates', {}, function(res) {
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
  onClickPopupClose: function(e) {
    $(e.target)
      .parents('.modal')
      .hide();
    $('body').removeClass('overflow-hidden');
  },
  onClickTemplateCell: function(e) {
    var $this = $(e.currentTarget);
    $('[data-template-cell].active').removeClass('active');
    $this.addClass('active');
  },
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
  onMouseEnterUnitRegion: function(e) {
    var $this = $(e.target),
      pageX = e.pageX,
      pageY = e.pageY,
      $hoverBody = $('#hover-popup-body'),
      regions = $this.attr('data-regions').split(',');
    $hoverBody.html('');
    regions.map(function(item) {
      $hoverBody.append(
        tpl.hoverRow.render({
          name: item,
        })
      );
    });
    var $hover = $('#hover-popup'),
      hoverWidth = $hover.width(),
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
  onMouseOutUnitRegion: function() {
    $('#hover-popup')
      .stop(!0)
      .fadeOut();
  },
  onClickUnitDelete: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-unit-delete'));
    commonFunc.confirm('确定删除这个项目吗', function() {
      seeAjax(
        'delete',
        {
          id: id,
        },
        function(res) {
          if (res.success) {
            $('[data-unit="' + id + '"]').remove();
            toastr.success('删除成功');
          } else {
            toastr.error('删除失败，请稍后再试');
          }
        }
      );
    });
  },
  onClickUnitCopy: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-unit-copy'));
    location.href = '/zzhadmin/createBuddhaIndex/?edit=0&id=' + id;
  },
  onClickUnitEdit: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-unit-edit'));
    location.href = '/zzhadmin/createBuddhaIndex/?edit=1&id=' + id;
  },
  onClickUnitPromote: function(e) {
    promotion.show({
      title: '预览',
      link: $(e.target).attr('data-url'),
    });
  },
  onClickUnitSort: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-unit-sort')),
      sequence = parseInt($this.attr('data-sequence'));
    data.currentSortId = id;
    $('#sort-popup-input').val(sequence);
    $('#sort-popup').show();
  },
  onClickSortPopupOk: function(e) {
    var sort = parseInt($('#sort-popup-input').val()) || 0;
    seeAjax(
      'sort',
      {
        id: data.currentSortId,
        sort: sort,
      },
      function(res) {
        if (res.success) {
          $('#sort-popup').hide();
          func.requestList();
          toastr.success('更新成功');
        } else {
          toastr.error('更新排序失败，请稍后重试');
        }
      }
    );
  },
});
