import $ from 'jquery';
import Swiper from 'swiper';
import browser from 'util/browser';
import temples from '../common/temples';
import review from '../common/review';
import '../common/nav';
import '../common/brand';
import juicer from 'juicer';
if (browser.isMobile) {
  $('#banner-item-cover-1').attr({
    src: 'https://pic.zizaihome.com/0e8b7400-1c5f-11e8-93fd-00163e0c001e.png',
  });
  $('#banner-item-cover-2').attr({
    src: 'https://pic.zizaihome.com/229278d6-1c5f-11e8-93fd-00163e0c001e.png',
  });
  $('#fo-shi-item-image-4').css({
    left: 35,
  });
}
var $templeWrapper = $('#temple-wrapper');
var templeItemTpl = juicer($('#tpl-temple-item').html());
temples.map(function(item) {
  $templeWrapper.append(templeItemTpl.render(item));
});
var $reviewWrapper1 = $('#review-wrapper-1');
var $reviewWrapper2 = $('#review-wrapper-2');
var $reviewWrapper3 = $('#review-wrapper-3');
var reviewItemTpl = juicer($('#tpl-review-item').html());
review[0].map(function(item) {
  $reviewWrapper1.append(reviewItemTpl.render(item));
});
review[1].map(function(item) {
  $reviewWrapper2.append(reviewItemTpl.render(item));
});
review[2].map(function(item) {
  $reviewWrapper3.append(reviewItemTpl.render(item));
});
setTimeout(function() {
  new Swiper('#swiper-1', {
    pagination: '#swiper-pagination-1',
    paginationClickable: !0,
    autoplay: 2000,
    autoplayDisableOnInteraction: !1,
    followFinger: !1,
    allowTouchMove: !1,
    loop: !0,
  });
}, 1000);
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
new Swiper('#swiper-3', {
  direction: browser.isMobile ? 'horizontal' : 'vertical',
  autoplay: 2000,
  autoplayDisableOnInteraction: !1,
  followFinger: !1,
  allowTouchMove: !1,
  loop: !0,
});
new Swiper('#swiper-4', {
  direction: browser.isMobile ? 'horizontal' : 'vertical',
  autoplay: 3000,
  autoplayDisableOnInteraction: !1,
  followFinger: !1,
  allowTouchMove: !1,
  loop: !0,
});
new Swiper('#swiper-5', {
  direction: browser.isMobile ? 'horizontal' : 'vertical',
  autoplay: 4000,
  autoplayDisableOnInteraction: !1,
  followFinger: !1,
  allowTouchMove: !1,
  loop: !0,
});
