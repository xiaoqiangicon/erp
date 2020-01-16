import $ from 'jquery';
import ChooseImage from '../../../com-deprecated/choose-image';
import indexData from '../data';
import commonTpl from '../tpl/common';
import introTpl from '../tpl/introduction';
import 'swiper';
import '../../../../pro-com/src/distpicker';
import seeView from 'see-view';
var chooseImageInstances = {};
seeView({
  events: {
    'keyup [data-introduction-introduction]':
      'onKeyUpInIntroductionIntroduction',
    'change [data-introduction-province]': 'onChangeInIntroductionProvince',
    'change [data-introduction-city]': 'onChangeInIntroductionCity',
    'change [data-introduction-district]': 'onChangeInIntroductionDistrict',
    'click [data-introduction-file-upload]': 'onClickIntroductionFileUpload',
  },
  onKeyUpInIntroductionIntroduction: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-introduction-introduction')),
      value = $this.val().trim();
    $('[data-introduction-introduction-display="' + id + '"]').text(value);
  },
  onChangeInIntroductionProvince: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-introduction-province')),
      province = $this.val();
    $('[data-introduction-place-display="' + id + '"]').text(province);
  },
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
  onClickIntroductionFileUpload: function(e) {
    var self = this,
      $this = $(e.target),
      id = parseInt($this.attr('data-introduction-file-upload')),
      chooseImage = chooseImageInstances[id];
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
  afterAddUploadFilesForIntroduction: function(data, id) {
    var $imageContainer,
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
    if (!data.length) {
      return;
    }
    data.map(function(item) {
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
