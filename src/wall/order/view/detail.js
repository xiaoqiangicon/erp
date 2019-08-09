/**
 * Created by senntyou on 2017/8/3.
 */

define([
  'jquery',
  'toastr',
  'common/function',
  'common/variables',
  '../../../../old-com/choose-image/src',
  '../data',
  '../tpl',
  './util',
  '../ajax',
  'lib/jquery.seeView',
  'component/choose_image_config/index',
], function($, toastr, commonFunc, commonVars, ChooseImage, data, tpl, util) {
  var upload; // 上传组件实例

  $.seeView({
    events: {
      // 点击保存备注信息
      '!click #detail-popup-save-memo': 'onClickDetailPopupSaveMemo',
      // 点击保存详细信息
      '!click #detail-popup-save': 'onClickDetailPopupSave',
      // 点击上传反馈图片
      '!click #detail-popup-feed-upload': 'onClickDetailPopupFeedUpload',
      // 点击删除一张图片
      'click [data-feed-image-item-delete]': 'onClickFeedImageItemDelete',
    },
    // 点击保存备注信息
    onClickDetailPopupSaveMemo: function(e) {
      var memo = $('#detail-popup-memo').val();
      $.seeAjax.get(
        'saveMemo',
        { id: data.currentDetailPopupId, memo: memo },
        function(res) {
          if (res.success) {
            toastr.success('保存成功');
          } else {
            toastr.error(res.message || '保存失败，请稍后再试');
          }
        }
      );
    },
    // 点击保存详细信息
    onClickDetailPopupSave: function(e) {
      var self = this,
        $items = $('[data-feed-image-item]'),
        images = [];

      $items.map(function() {
        images.push($(this).attr('data-image'));
      });

      $.seeAjax.post(
        'handle',
        {
          id: data.currentDetailPopupId,
          type: data.currentTabType - 1,
          image: images.join(','),
        },
        function(res) {
          if (res.success) {
            $('#detail-popup').hide();
            $('body').removeClass('overflow-hidden');
            util.refreshCurrentPage();
            toastr.success('保存成功');
          } else {
            toastr.error(res.message || '保存失败，请稍后再试');
          }
        }
      );
    },
    // 点击上传反馈图片
    onClickDetailPopupFeedUpload: function(e) {
      var self = this;
      // 尚未实例化
      if (!upload) {
        upload = new ChooseImage({
          multiSelect: !0,
          onSubmit: function(images) {
            self.afterUploadImages(images);
          },
        });
      }
      upload.show();
    },
    afterUploadImages: function(images) {
      var self = this,
        $originItems = $('[data-feed-image-item]'),
        originImages = [];

      $originItems.map(function() {
        originImages.push($(this).attr('data-image'));
      });

      images &&
        images.map(function(item) {
          originImages.length < 10 && originImages.push(item.src);
        });

      self.saveFeedImages(originImages);
    },
    saveFeedImages: function(images) {
      var self = this;
      $.seeAjax.post(
        'updateFeedImage',
        {
          id: data.currentDetailPopupId,
          type: 2 - data.currentTabType,
          image: images.join(','),
        },
        function(res) {
          if (res.success) {
            toastr.success('更新图片成功');
            self.renderFeedImages(images);
          } else {
            toastr.error(res.message || '更新图片失败，请稍后再试');
          }
        }
      );
    },
    renderFeedImages: function(images) {
      var $container = $('#detail-popup-feed-images'),
        $upload = $('#detail-popup-feed-upload').parent();

      $container.html('');
      images.map(function(image) {
        $container.append(tpl.imageCell.render({ image: image }));
      });

      if (images.length >= 10) $upload.addClass('hide');
      else $upload.removeClass('hide');
    },
    // 点击删除一张图片
    onClickFeedImageItemDelete: function(e) {
      var $this = $(e.target).parent();

      var self = this,
        $originItems = $('[data-feed-image-item]'),
        originImages = [];

      $originItems.map(function() {
        var self = this;
        if (self != $this[0]) originImages.push($(self).attr('data-image'));
      });

      self.saveFeedImages(originImages);
    },
  });
});
