import $ from 'jquery';
import Swiper from 'swiper';
import browser from 'util/browser';
import temples from '../common/temples';
import foShi from '../common/fo_shi';
import '../common/nav';
import '../common/brand';
import 'juicer';
if (browser.isMobile) {
  $('#nav-register')
    .text('下载APP')
    .attr({
      href: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.miaoyan.shanzai',
    });
}
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
