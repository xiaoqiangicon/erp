/**
 * Created by senntyou on 2017/2/27.
 */

define([
  'jquery',
  '../data',
  '../tpl/common',
  '../tpl/introduction',
  '../../../../../old-com/distpicker/src',
  'jquery-confirm',
], function($, indexData, commonTpl, introTpl) {
  // 添加寺院介绍组件后事件添加
  function postHandleForIntroduction($displayComponent, $editContainer, data) {
    var id = data.id,
      // 展示部分的滑动图片
      $swiperWrapper = $displayComponent.find('.swiper-wrapper'),
      // 上传按钮
      $uploadAdd = $editContainer.find('[data-file-upload-container]'),
      // html字符串
      swiperWrapperInnerHtml = '';

    // 渲染展示部分的滑动图片
    data.images.map(function(item) {
      var newItem = {
        id: id,
        imageId: item.id,
        image: item.url,
        type: 1,
        isUpdate: 1,
      };
      indexData.misc.imageId <= item.id &&
        (indexData.misc.imageId = item.id + 1);
      swiperWrapperInnerHtml += introTpl.displayImageCell.render(newItem);
      $uploadAdd.before($(commonTpl.uploadCell.render(newItem)));
    });

    // 如果图片数过多，隐藏上传按钮
    data.images.length >= indexData.misc.introductionUploadLimit &&
      $uploadAdd.hide();
    $swiperWrapper.html(swiperWrapperInnerHtml);

    // 添加地址选择器
    $editContainer.find('[data-place-picker]').distpicker({
      province: data.province,
      city: data.city,
      district: data.district || '—— 区 ——',
    });
    // 地址更新到界面中
    $displayComponent
      .find('[data-introduction-place-display]')
      .text(
        data.province +
          ' ' +
          data.city +
          (data.district ? ' ' + data.district : '')
      );

    // 替换 <br> 为 \n
    data.introduction = data.introduction.replace(/<br>/g, '\n');

    // 介绍内容跟新到展示组件
    $displayComponent
      .find('[data-introduction-introduction-display]')
      .text(data.introduction);
    // 介绍内容更新到编辑组件
    $editContainer
      .find('[data-introduction-introduction]')
      .val(data.introduction);
    // 更新字数统计
    $editContainer
      .find('[data-input-count-display]')
      .text(data.introduction.length);

    // 图片列表启动排序
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
          // 更换图片尺寸
          $introductionWrapper.append(introTpl.displayImageCell.render(item));
        });
      },
    });
  }

  return postHandleForIntroduction;
});
