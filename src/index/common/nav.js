import $ from 'jquery';
import browser from 'util/browser';
var $body = $('body');
var navIndex = parseInt($body.attr('data-nav-index'));
var $navItems = $('[data-nav-item]');
$($navItems[navIndex]).addClass('active');
if (browser.isMobile) {
  $body.css({
    'padding-top': 50,
  });
  $('#nav-register').attr({
    href: 'https://wx.zizaihome.com/temple/templeInfo',
  });
}
if (!browser.isMobile) {
  var lastScrollTop = 0;
  var $nav = $('#nav');
  var $win = $(window);
  $win.scroll(function(e) {
    var winScrollTop = $win.scrollTop();
    if (winScrollTop > lastScrollTop) {
      $nav.addClass('out');
    } else {
      $nav.removeClass('out');
    }
    if (winScrollTop <= 0) $nav.removeClass('show-bg');
    else $nav.addClass('show-bg');
    lastScrollTop = winScrollTop;
  });
}
$('#nav-category').click(function(e) {
  $('#nav').toggleClass('show-category');
  $body.toggleClass('overflow-hidden');
});
