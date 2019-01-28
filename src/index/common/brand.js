/**
 * @author senntyou <jiangjinbelief@163.com>
 */

define(['jquery', 'util/browser'], function($, browser) {
  if (browser.isMobile) {
    var $brandRight = $('#brand-right');
    $brandRight.append($('#brand-menu-2'));
    $brandRight.append($('#brand-copyright'));
  }

  // zizaihome.cn 备案号是 1
  if (location.hostname.slice(-3) === '.cn') {
    $('#brand-copyright-number').text(1);
  }
});
