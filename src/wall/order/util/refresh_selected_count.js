define(['jquery'], function($) {
  var $selectedCount = $('#selected-count');

  return function() {
    $selectedCount.text($('[data-row-select].active').length);
  };
});
