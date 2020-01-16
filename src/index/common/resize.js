import $ from 'jquery';
import browser from 'util/browser';
var heightRecord = {};
if (!browser.isMobile) {
  $('[data-same-height]').map(function() {
    var $this = $(this);
    var id = parseInt($this.attr('data-same-height'));
    var height = $this.outerHeight();
    if (!heightRecord[id]) heightRecord[id] = height;
    else {
      $('[data-same-height="' + id + '"]').css({
        height: Math.max(heightRecord[id], height),
      });
      height > heightRecord[id] && (heightRecord[id] = height);
    }
  });
}
