/**
 * Created by senntyou on 2017/5/20.
 */

define([
  'jquery',
  '../../../../old-com/choose-image/src',
  '../data',
  '../tpl/common',
  '../tpl/introduction',
  'swiper',
  '../../../../old-com/distpicker/src',
  'lib/jquery.seeView',
  'component/choose_image_config/index',
], function($, ChooseImage, indexData, commonTpl, introTpl) {
  var chooseImageInstances = {}; // 以id为键

  $.seeView({
    events: {
      // 介绍组件的介绍语
      'keyup [data-introduction-introduction]':
        'onKeyUpInIntroductionIntroduction',
      // 选择省
      'change [data-introduction-province]': 'onChangeInIntroductionProvince',
      // 选择城市
      'change [data-introduction-city]': 'onChangeInIntroductionCity',
      // 选择区县
      'change [data-introduction-district]': 'onChangeInIntroductionDistrict',
      // 点击寺院简介的添加图片
      'click [data-introduction-file-upload]': 'onClickIntroductionFileUpload',
    },
    // 介绍组件的介绍语
    onKeyUpInIntroductionIntroduction: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-introduction-introduction')),
        value = $this.val().trim();
      $('[data-introduction-introduction-display="' + id + '"]').text(value);
    },
    // 选择省
    onChangeInIntroductionProvince: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-introduction-province')),
        province = $this.val();

      $('[data-introduction-place-display="' + id + '"]').text(province);
    },
    // 选择城市
    onChangeInIntroductionCity: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-introduction-city')),
        province = $('[data-introduction-province="' + id + '"]').val(),
        city = $this.val(),
        place = province;

      !!city && (place = province + ' ' + city);
      $('[data-introduction-place-display="' + id + '"]').text(place);
    },
    // 选择区县
    onChangeInIntroductionDistrict: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-introduction-district')),
        province = $('[data-introduction-province="' + id + '"]').val(),
        city = $('[data-introduction-city="' + id + '"]').val(),
        district = $this.val(),
        place = province + ' ' + city;

      !!district && (place += ' ' + district);
      $('[data-introduction-place-display="' + id + '"]').text(place);
    },
    // 点击寺院简介的添加图片
    onClickIntroductionFileUpload: function(e) {
      var self = this,
        $this = $(e.target),
        id = parseInt($this.attr('data-introduction-file-upload')),
        chooseImage = chooseImageInstances[id];

      // 尚未实例化
      if (!chooseImage) {
        chooseImage = new ChooseImage({
          multiSelect: !0,
          onSubmit: function(data) {
            self.afterAddUploadFilesForIntroduction(data, id);
          },
        });
        chooseImageInstances[id] = chooseImage;
      }

      chooseImage.show();
    },
    // 上传介绍组件图片
    afterAddUploadFilesForIntroduction: function(data, id) {
      var $imageContainer,
        // 剩余可上传图片
        remainUploadCount =
          indexData.misc.introductionUploadLimit -
          $('[data-upload-image-container="' + id + '"][data-type="1"]').length,
        $uploadEl = $('[data-introduction-file-upload="' + id + '"]').parents(
          '[data-file-upload-container]'
        ),
        $swiperWrapper = $(
          '[data-container="component-display"][data-id="' +
            id +
            '"][data-type="1"]'
        ).find('.swiper-wrapper');

      // 没有数据，返回
      if (!data.length) {
        return;
      }

      //显示内容
      data.map(function(item) {
        // 添加图片裁剪后缀
        item.src += indexData.imagesParams[1];

        var currentImageId = indexData.misc.imageId++;
        if (remainUploadCount <= 0) return;
        $imageContainer = $(
          commonTpl.uploadCell.render({
            id: id,
            image: item.src,
            imageId: currentImageId,
            type: 1,
            isUpdate: 0,
          })
        );
        // 没有任何图片，或者只有示例图片
        if (
          !$(
            '[data-component-id="' +
              id +
              '"][data-display-image-id][data-type="1"]'
          ).length
        ) {
          $swiperWrapper.html(
            introTpl.displayImageCell.render({
              id: id,
              image: item.src,
              imageId: currentImageId,
              type: 1,
            })
          );
        } else {
          $swiperWrapper.append(
            introTpl.displayImageCell.render({
              id: id,
              image: item.src,
              imageId: currentImageId,
              type: 1,
            })
          );
        }
        $uploadEl.before($imageContainer);
        remainUploadCount--;

        if (remainUploadCount <= 0) {
          $('[data-file-upload-container="' + id + '"][data-type="1"]').hide();
        }
      });
    },
  });
});
