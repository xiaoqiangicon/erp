/**
 * @author senntyou <jiangjinbelief@163.com>
 */

define(['jquery'], function($) {
  setTimeout(function() {
    $('input').focus(function() {
      $('#hint').hide();
    });
  }, 3000);
});
