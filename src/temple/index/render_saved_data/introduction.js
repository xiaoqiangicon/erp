import $ from 'jquery';
import indexData from '../data';
import commonTpl from '../tpl/common';
import introTpl from '../tpl/introduction';
import '../../../../../old-com/distpicker/src';
import 'jquery-confirm';
function postHandleForIntroduction($displayComponent, $editContainer, data) {
  var id = data.id,
    $swiperWrapper = $displayComponent.find('.swiper-wrapper'),
    $uploadAdd = $editContainer.find('[data-file-upload-container]'),
    swiperWrapperInnerHtml = '';
  data.images.map(function(item) {
    var newItem = {
      id: id,
      imageId: item.id,
      image: item.url,
      type: 1,
      isUpdate: 1,
    };
    indexData.misc.imageId <= item.id && (indexData.misc.imageId = item.id + 1);
    swiperWrapperInnerHtml += introTpl.displayImageCell.render(newItem);
    $uploadAdd.before($(commonTpl.uploadCell.render(newItem)));
  });
  data.images.length >= indexData.misc.introductionUploadLimit &&
    $uploadAdd.hide();
  $swiperWrapper.html(swiperWrapperInnerHtml);
  $editContainer.find('[data-place-picker]').distpicker({
    province: data.province,
    city: data.city,
    district: data.district || '—— 区 ——',
  });
  $displayComponent
    .find('[data-introduction-place-display]')
    .text(
      data.province +
        ' ' +
        data.city +
        (data.district ? ' ' + data.district : '')
    );
  data.introduction = data.introduction.replace(/<br>/g, '\n');
  $displayComponent
    .find('[data-introduction-introduction-display]')
    .text(data.introduction);
  $editContainer
    .find('[data-introduction-introduction]')
    .val(data.introduction);
  $editContainer
    .find('[data-input-count-display]')
    .text(data.introduction.length);
  $editContainer.find('[data-introduction-images-container]').sortable({
    items: 'li:not([data-file-upload-container])',
    stop: function(e) {
      var $introductionWrapper = $('[data-introduction-swiper-wrapper]'),
        $imageContainers = $('[data-upload-image-container][data-type="1"]'),
        items = [];
      $imageContainers.map(function() {
        var $this = $(this),
          isUpdate = parseInt($this.attr('data-is-update')),
          imageId = parseInt($this.attr('data-image-id')),
          src = $this.find('img').attr('src');
        items.push({
          id: id,
          image: src,
          imageId: imageId,
          type: 1,
          isUpdate: isUpdate,
        });
      });
      $introductionWrapper.html('');
      items.map(function(item) {
        $introductionWrapper.append(introTpl.displayImageCell.render(item));
      });
    },
  });
}
export default postHandleForIntroduction;
