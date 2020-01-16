import $ from 'jquery';
var $prizeOk = $('#prize-ok');
export default function(value) {
  value = parseFloat(value);
  if (value <= 0) $prizeOk.removeClass('active').text('下次支持');
  else $prizeOk.addClass('active').text('确认支持');
}
