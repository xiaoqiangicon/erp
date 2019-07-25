/**
 * Created by senntyou on 2017/6/20.
 */

define(['jquery'], function($) {
  var func = {
    // 图文组件指定条目
    reshowSwipeList: function(id, type, index) {
      var itemsCount = parseInt(
        $('[data-swipe-list-items-count="' + id + '"]').val()
      );

      $(
        '[data-swipe-list-cell="' +
          id +
          '"][data-type="' +
          type +
          '"][data-index="' +
          index +
          '"]'
      ).map(function(index) {
        index < itemsCount
          ? $(this).css({
              display: 'inline-block',
            })
          : $(this).hide();
      });
    },
  };

  return func;
});
