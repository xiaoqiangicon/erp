/**
 * @author senntyou <jiangjinbelief@163.com>
 */

define([
  'jquery',
  'swiper',
  'util/browser',
  '../common/temples',
  '../common/fo_shi',
  '../common/nav',
  '../common/resize',
  '../common/brand',
  'juicer',
], function($, Swiper, browser, temples, foShi) {
  var $templeWrapper = $('#temple-wrapper');
  var templeItemTpl = juicer($('#tpl-temple-item').html());

  temples.map(function(item) {
    $templeWrapper.append(templeItemTpl.render(item));
  });

  var $foShiWrapper = $('#fo-shi-wrapper');
  var foShiItemTpl = juicer($('#tpl-fo-shi-item').html());

  foShi.map(function(item) {
    $foShiWrapper.append(foShiItemTpl.render(item));
  });

  new Swiper('#swiper-1', {
    slidesPerView: 'auto',
    spaceBetween: 12,
    followFinger: !1,
    autoplay: 2000,
    autoplayDisableOnInteraction: !1,
    loop: !0,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    simulateTouch: !1,
  });
  new Swiper('#swiper-2', {
    slidesPerView: 'auto',
    spaceBetween: 12,
    followFinger: !1,
    autoplay: 2000,
    autoplayDisableOnInteraction: !1,
    loop: !0,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    simulateTouch: !1,
  });

  var $win = $(window);
  var winWidth = $win.width();

  var $hoverPopup = $('#hover-popup');
  var $hoverPopupImage = $hoverPopup.find('img');
  var hoverPopupHeight = 150;

  var $hovers = $('[data-hover-popup]');

  if (!browser.isMobile) {
    $hovers.on('mouseenter', function(e) {
      var pageX = e.pageX;
      var pageY = e.pageY;
      var $this = $(e.target);
      var image = $this.attr('data-hover-popup');

      $hoverPopupImage.attr({ src: image });

      var hoverX = 0,
        hoverY = 0,
        showOnRight = !1; // 是否显示在右边
      // 显示在右边
      if (pageX < winWidth / 2) {
        hoverX = pageX + 60;
        showOnRight = !0;
      }
      // 显示在左边
      else {
        hoverX = winWidth - pageX + 60;
        showOnRight = !1;
      }
      hoverY = pageY - hoverPopupHeight / 2;

      $hoverPopup.css({
        top: hoverY + 'px',
        left: showOnRight ? hoverX + 'px' : 'auto',
        right: !showOnRight ? hoverX + 'px' : 'auto',
      });

      $hoverPopup.stop(!0).fadeIn();
    });

    $hovers.on('mouseout', function(e) {
      $hoverPopup.stop(!0).fadeOut();
    });
  } else {
    $hovers.click(function() {
      location.href = $(this).attr('data-link');
    });
  }
});
