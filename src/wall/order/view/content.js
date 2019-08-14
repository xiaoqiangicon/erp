import $ from 'jquery';
import toastr from 'toastr';
import QRCode from '../../../../pro-com/src/qrcode';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
import tpl from '../tpl';
import func from '../function';
import util from './util';
import refreshSelectedCount from '../util/refresh_selected_count';
import '../ajax';
import 'lib/jquery.seeView';
$.seeView({
  events: {
    'click [data-row-select]': 'onClickRowSelect',
    'click [data-page-index]': 'onClickPageIndex',
    '!click #action-handle': 'onClickActionHandle',
    '!click #action-export': 'onClickActionExport',
    'click [data-row-detail]': 'onClickRowDetail',
  },
  onClickRowSelect: function(e) {
    var $this = $(e.currentTarget);
    $this.toggleClass('active');
    this.checkSelectAllStatus();
    refreshSelectedCount();
  },
  checkSelectAllStatus: function() {
    var allSelected =
        $('[data-row-select]').length == $('[data-row-select].active').length,
      $selectAll = $('#select-all');
    if (allSelected) $selectAll.addClass('active');
    else $selectAll.removeClass('active');
  },
  onClickPageIndex: function(e) {
    var $this = $(e.target),
      currentPage = parseInt($this.attr('data-current-page')),
      pageIndex = parseInt($this.attr('data-page-index')),
      page =
        pageIndex == -1
          ? currentPage - 1
          : pageIndex == -2
          ? currentPage + 1
          : pageIndex;
    if (data.currentTabType == 1) {
      func.requestUnhandledOrdersList(page);
    } else {
      func.requestHandledOrdersList(page);
    }
  },
  onClickActionHandle: function(e) {
    var self = this,
      $selected = $('[data-row-select].active');
    if (!$selected.length) {
      toastr.warning('请先选择要处理的订单');
      return;
    }
    var ids = [];
    $selected.map(function() {
      ids.push(parseInt($(this).attr('data-row-select')));
    });
    $.seeAjax.post(
      'handle',
      {
        id: ids.join(','),
        type: 0,
      },
      function(res) {
        if (res.success) {
          util.refreshCurrentPage();
          toastr.success('处理成功');
        } else {
          toastr.error(res.message || '处理失败，请稍后再试');
        }
      }
    );
  },
  onClickActionExport: function(e) {
    var filter = [data.unhandledOrdersFilter, data.handledOrdersFilter][
      data.currentTabType - 1
    ];
    window.open(
      '/zzhadmin/buddhaWall_orderExcel/?beginDate=' +
        filter.startDate +
        '&endDate=' +
        filter.endDate +
        '&searchText=' +
        filter.search +
        '&wallId=' +
        filter.regionId +
        '&filterType=' +
        data.currentTabType
    );
  },
  onClickRowDetail: function(e) {
    var $this = $(e.target),
      id = parseInt($this.attr('data-row-detail'));
    $.seeAjax.get(
      'detail',
      {
        id: id,
      },
      function(res) {
        if (res.success) {
          $('#detail-popup-title').text(res.data.name + ' ' + res.data.place);
          $('#detail-popup-sequence').text(res.data.sequence);
          $('#detail-popup-time').text(res.data.time);
          $('#detail-popup-money').text(res.data.money);
          $('#detail-popup-type').text(res.data.type);
          $('#detail-popup-order-number').text(res.data.orderNumber);
          $('#detail-popup-flow-number').text(res.data.flowNumber);
          var $qrCodeContainer = $('#detail-popup-qr-code');
          $qrCodeContainer.html('');
          new QRCode($qrCodeContainer[0], {
            text: res.data.url,
            width: 100,
            height: 100,
          });
          var $writeName = $('#detail-popup-write-name');
          var $writeNameContainer = $writeName.parent();
          if (res.data.writeName) {
            $writeNameContainer.removeClass('hide');
            $writeName.text(res.data.writeName);
          } else {
            $writeNameContainer.addClass('hide');
          }
          var $yangSahngRen = $('#detail-popup-yang-shang-ren');
          var $yangSahngRenContainer = $yangSahngRen.parent();
          if (res.data.yangShangRen) {
            $yangSahngRenContainer.removeClass('hide');
            $yangSahngRen.text(res.data.yangShangRen);
          } else {
            $yangSahngRenContainer.addClass('hide');
          }
          var $wangShengZhe = $('#detail-popup-wang-sheng-zhe');
          var $wangShengZheContainer = $wangShengZhe.parent();
          if (res.data.wangShengZhe) {
            $wangShengZheContainer.removeClass('hide');
            $wangShengZhe.text(res.data.wangShengZhe);
          } else {
            $wangShengZheContainer.addClass('hide');
          }
          var $wish = $('#detail-popup-wish');
          var $wishContainer = $wish.parent();
          if (res.data.wish) {
            $wishContainer.removeClass('hide');
            $wish.text(res.data.wish);
          } else {
            $wishContainer.addClass('hide');
          }
          var feedImages = res.data.feedImage && res.data.feedImage.split(',');
          var $imageContainer = $('#detail-popup-feed-images');
          $imageContainer.html('');
          if (feedImages) {
            feedImages.map(function(image) {
              $imageContainer.append(
                tpl.imageCell.render({
                  image: image,
                })
              );
            });
          }
          feedImages.length >= 10 &&
            $('#detail-popup-feed-upload')
              .parent()
              .addClass('hide');
          var $contact = $('#detail-popup-contact');
          $contact.html('');
          res.data.contactList &&
            res.data.contactList.length &&
            res.data.contactList.map(function(item) {
              $contact.append(tpl.contactCell.render(item));
            });
          res.data.memo && $('#detail-popup-memo').val(res.data.memo);
          var $save = $('#detail-popup-save');
          $save.text(data.detailPopupSaveTexts[data.currentTabType - 1]);
          data.currentDetailPopupId = id;
          $('body').addClass('overflow-hidden');
          $('#detail-popup')
            .show()
            .scrollTop(0);
        } else {
          toastr.error(res.message || '获取订单信息失败，请稍后再试');
        }
      }
    );
  },
});
