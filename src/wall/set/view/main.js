/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'toastr',
  'common/function',
  'common/variables',
  '../data',
  '../tpl',
  '../function',
  '../../../../old-com/choose-image/src',
  '../ajax',
  'lib/jquery.seeView',
], function($, toastr, commonFunc, commonVars, data, tpl, func, ChooseImage) {
  var coverUpload, previewUpload, shareUpload;

  $.seeView({
    events: {
      // 点击删除封面图片
      'click [data-cover-image-cell-delete]': 'onClickCoverImageCellDelete',
      // 点击删除预览图片
      'click [data-preview-image-cell-delete]': 'onClickPreviewImageCellDelete',
      // 点击添加封面图片
      '!click #content-cover-image-add': 'onClickContentCoverImageAdd',
      // 点击添加效果图片
      '!click #content-preview-image-add': 'onClickContentPreviewImageAdd',
      // 点击填充默认随喜金额
      '!click #fill-random-money': 'onClickFillRandomMoney',
      // 监听随喜金额输入
      '!keyup #input-random-money': 'onKeyupInputRandomMoney',
      // 是否随喜变化
      'change input[name="content-pay"]': 'onChangeContentPay',
      // 点击设置附言
      'click [data-memo-config]': 'onClickMemoConfig',
      // 确定附言的修改
      '!click #pray-popup-ok': 'onClickPrayPopupOk',
      // 点击设置小票打印机
      '!click #content-set-printer': 'onClickContentSetPrinter',
      // 点击添加分享图片
      '!click #content-share-image-add': 'onClickContentShareImageAdd',
      // 点击删除分享图片
      'click [data-share-image-cell-delete]': 'onClickShareImageCellDelete',
      // 供奉类型改变
      '!change #input-category': 'onChangeInputCategory',
    },
    // 点击删除封面图片
    onClickCoverImageCellDelete: function(e) {
      $(e.target)
        .parent()
        .remove();
      $('#content-cover-image-add').show();
    },
    // 点击删除预览图片
    onClickPreviewImageCellDelete: function(e) {
      $(e.target)
        .parent()
        .remove();
      $('#content-preview-image-add').show();
    },
    // 点击添加封面图片
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
      $uploadEl.before(tpl.coverImageCell.render({ image: res[0].src }));
      $uploadEl.hide();
    },
    // 点击添加效果图片
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
        $uploadEl.before(tpl.previewImageCell.render({ image: item.src }));
      });

      if (currentTotal >= 3) $uploadEl.hide();
    },
    // 点击填充默认随喜金额
    onClickFillRandomMoney: function(e) {
      $('#input-random-money').val(data.defaultRandomMoney);
      $('#fill-random-money').hide();
    },
    // 监听随喜金额输入
    onKeyupInputRandomMoney: function(e) {
      $('#fill-random-money').show();
    },
    // 是否随喜变化
    onChangeContentPay: function(e) {
      var usePay = !!parseInt(
        $('input[name="content-pay"]:checked').attr('value')
      );
      var $contentRandomMoney = $('#content-random-money');
      usePay ? $contentRandomMoney.show() : $contentRandomMoney.hide();
    },
    // 点击设置附言
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
    // 确定附言的修改
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
    // 点击设置小票打印机
    onClickContentSetPrinter: function(e) {
      $('#printer-popup').show();
      $('body').addClass('overflow-hidden');
    },
    // 点击添加分享图片
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
      $uploadEl.before(tpl.shareImageCell.render({ image: res[0].src }));
      $uploadEl.hide();
    },
    // 点击删除分享图片
    onClickShareImageCellDelete: function(e) {
      $(e.target)
        .parent()
        .remove();
      $('#content-share-image-add').show();
    },
    // 供奉类型改变
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
});
