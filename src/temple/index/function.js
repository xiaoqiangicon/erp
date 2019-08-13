import $ from 'jquery';
var func = {
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
export default func;
