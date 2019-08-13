import $ from 'jquery';
import browser from 'util/browser';
import '../common/nav';
import '../common/brand';
$('[data-tab]').click(function(e) {
  var $this = $(e.currentTarget);
  if ($this.hasClass('active')) return;
  var id = parseInt($this.attr('data-tab'));
  $('[data-tab]').removeClass('active');
  $('[data-tab="' + id + '"]').addClass('active');
  var $intro1 = $('#intro-1');
  var $intro2 = $('#intro-2');
  var $detail1 = $('#detail-1');
  var $detail2 = $('#detail-2');
  if (id === 1) {
    $intro1.show();
    $detail1.show();
    $intro2.hide();
    $detail2.hide();
  } else {
    $intro1.hide();
    $detail1.hide();
    $intro2.show();
    $detail2.show();
  }
});
if (browser.isMobile) {
  var $intro2 = $('#intro-2');
  $intro2.append($intro2.find('.inner-left-2'));
  $intro2.show();
  $('#detail-2').show();
  var $introContainer = $('<div class="intro"></div>');
  $('#detail-1').after($introContainer);
  $introContainer.append($intro2);
  $('.intro-qr-text').text('长按识别二维码');
  var $detailUnitLeft2 = $('#detail-unit-left-2');
  var $detailUnitRight2 = $('#detail-unit-right-2');
  $('#detail-unit-2').prepend($detailUnitRight2);
  $detailUnitRight2.removeClass('unit-right').addClass('unit-left');
  $detailUnitLeft2.removeClass('unit-left').addClass('unit-right');
  var $detailUnitLeft4 = $('#detail-unit-left-4');
  var $detailUnitRight4 = $('#detail-unit-right-4');
  $('#detail-unit-4').prepend($detailUnitRight4);
  $detailUnitRight4.removeClass('unit-right').addClass('unit-left');
  $detailUnitLeft4.removeClass('unit-left').addClass('unit-right');
}
