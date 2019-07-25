/**
 * @author senntyou <jiangjinbelief@163.com>
 */

define(['jquery', 'util/browser'], function($, browser) {
  var heightRecord = {
    // id: height
  };

  if (!browser.isMobile) {
    // 多个元素保持同一个高度
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
});
