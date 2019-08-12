import $ from "jquery";
import "lib/jquery.seeView";
import "@fancyapps/fancybox";
$.seeView({
  events: {
    "click [data-show-images]": "onClickShowImages"
  },
  onClickShowImages: function (e) {
    var $this = $(e.target), imagesStr = $this.attr("data-show-images"), imagesArr = imagesStr.split(","), images = [];
    imagesArr.map(function (src) {
      images.push({
        src: src
      });
    });
    $.fancybox.open(images, {
      lang: "zh",
      thumbs: {
        autoStart: true
      }
    });
  }
});
