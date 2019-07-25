/**
 * Created by senntyou on 2017/3/29.
 */
define(['jquery', 'lib/jquery.seeView', '@fancyapps/fancybox'], function($) {
  $.seeView({
    events: {
      // 点击显示回单照片
      'click [data-show-images]': 'onClickShowImages',
    },
    // 点击显示照片
    onClickShowImages: function(e) {
      var $this = $(e.target),
        imagesStr = $this.attr('data-show-images'),
        imagesArr = imagesStr.split(','),
        images = [];

      imagesArr.map(function(src) {
        images.push({ src: src });
      });
      $.fancybox.open(images, { lang: 'zh', thumbs: { autoStart: true } });
    },
  });
});
