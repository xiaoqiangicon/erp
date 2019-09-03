import $ from 'jquery';
import toastr from 'toastr';
import commonFunc from 'common/function';
import commonVars from 'common/variables';
import data from '../data';
import tpl from '../tpl';
import func from '../function';
import ChooseImage from '../../../../old-com/choose-image/src';
import '../ajax';
import seeView from 'see-view';
var coverUpload, previewUpload, shareUpload;
seeView({
  events: {
    'click [data-cover-image-cell-delete]': 'onClickCoverImageCellDelete',
    'click [data-preview-image-cell-delete]': 'onClickPreviewImageCellDelete',
    '!click #content-cover-image-add': 'onClickContentCoverImageAdd',
    '!click #content-preview-image-add': 'onClickContentPreviewImageAdd',
    '!click #fill-random-money': 'onClickFillRandomMoney',
    '!keyup #input-random-money': 'onKeyupInputRandomMoney',
    'change input[name="content-pay"]': 'onChangeContentPay',
    'click [data-memo-config]': 'onClickMemoConfig',
    '!click #pray-popup-ok': 'onClickPrayPopupOk',
    '!click #content-set-printer': 'onClickContentSetPrinter',
    '!click #content-share-image-add': 'onClickContentShareImageAdd',
    'click [data-share-image-cell-delete]': 'onClickShareImageCellDelete',
    '!change #input-category': 'onChangeInputCategory',
  },
  onClickCoverImageCellDelete: function(e) {
    $(e.target)
      .parent()
      .remove();
    $('#content-cover-image-add').show();
  },
  onClickPreviewImageCellDelete: function(e) {
    $(e.target)
      .parent()
      .remove();
    $('#content-preview-image-add').show();
  },
  onClickContentCoverImageAdd: function(e) {
    var self = this;
    if (!coverUpload) {
      coverUpload = new ChooseImage({
        multiSelect: !1,
        onSubmit: function(res) {
          self.afterUploadCover(res);
        },
      });
    }
    coverUpload.show();
  },
  afterUploadCover: function(res) {
    if (!res || !res.length) return;
    var $uploadEl = $('#content-cover-image-add');
    $uploadEl.before(
      tpl.coverImageCell.render({
        image: res[0].src,
      })
    );
    $uploadEl.hide();
  },
  onClickContentPreviewImageAdd: function(e) {
    var self = this;
    if (!previewUpload) {
      previewUpload = new ChooseImage({
        multiSelect: !0,
        onSubmit: function(res) {
          self.afterUploadPreviewImage(res);
        },
      });
    }
    previewUpload.show();
  },
  afterUploadPreviewImage: function(res) {
    if (!res || !res.length) return;
    var currentTotal = res.length + $('[data-preview-image-cell]').length;
    if (currentTotal > 3) {
      commonFunc.dialog('封面图片最多只能添加3张');
      return;
    }
    var $uploadEl = $('#content-preview-image-add');
    res.map(function(item) {
      $uploadEl.before(
        tpl.previewImageCell.render({
          image: item.src,
        })
      );
    });
    if (currentTotal >= 3) $uploadEl.hide();
  },
  onClickFillRandomMoney: function(e) {
    $('#input-random-money').val(data.defaultRandomMoney);
    $('#fill-random-money').hide();
  },
  onKeyupInputRandomMoney: function(e) {
    $('#fill-random-money').show();
  },
  onChangeContentPay: function(e) {
    var usePay = !!parseInt(
      $('input[name="content-pay"]:checked').attr('value')
    );
    var $contentRandomMoney = $('#content-random-money');
    usePay ? $contentRandomMoney.show() : $contentRandomMoney.hide();
  },
  onClickMemoConfig: function(e) {
    var $this = $(e.target),
      length = parseInt($this.attr('data-length')) || '',
      disabled = !!parseInt($this.attr('data-disabled'));
    if (disabled) return;
    var type = parseInt($this.attr('data-memo-config')),
      name = $('[data-memo-name="' + type + '"]').text();
    $('#pray-popup-title').text(name);
    $('#pray-popup-input').val(length);
    data.currentMemoType = type;
    $('#pray-popup').show();
    $('body').addClass('overflow-hidden');
  },
  onClickPrayPopupOk: function(e) {
    var originValue = $('#pray-popup-input').val();
    var value = parseInt(originValue);
    if (originValue != '' && (!value || value < 0)) {
      toastr.error('请输入大于0的数字');
      return;
    }
    value = value || '';
    $('[data-memo-config="' + data.currentMemoType + '"]').attr({
      'data-length': value,
    });
    $('#pray-popup').hide();
    $('body').removeClass('overflow-hidden');
  },
  onClickContentSetPrinter: function(e) {
    $('#printer-popup').show();
    $('body').addClass('overflow-hidden');
  },
  onClickContentShareImageAdd: function() {
    var self = this;
    if (!shareUpload) {
      shareUpload = new ChooseImage({
        multiSelect: !1,
        onSubmit: function(res) {
          self.afterUploadShare(res);
        },
      });
    }
    shareUpload.show();
  },
  afterUploadShare: function(res) {
    if (!res || !res.length) return;
    var $uploadEl = $('#content-share-image-add');
    $uploadEl.before(
      tpl.shareImageCell.render({
        image: res[0].src,
      })
    );
    $uploadEl.hide();
  },
  onClickShareImageCellDelete: function(e) {
    $(e.target)
      .parent()
      .remove();
    $('#content-share-image-add').show();
  },
  onChangeInputCategory: function(e) {
    var $this = $(e.target),
      value = parseInt($this.val()),
      $contentRowBuddha = $('#content-row-buddha'),
      $contentRowPaiWei = $('#content-row-pai-wei');
    if (value == 2) {
      $contentRowBuddha.hide();
      $contentRowPaiWei.show();
    } else {
      $contentRowBuddha.show();
      $contentRowPaiWei.hide();
    }
  },
});
