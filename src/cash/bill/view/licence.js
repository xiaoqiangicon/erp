import $ from 'jquery';
import 'lib/jquery.seeView';
var $body = $('body');
var $prizeAgree = $('#prize-agree');
$.seeView({
  events: {
    'click #licence-ok': 'onClickLicenceOk',
  },
  onClickLicenceOk: function(e) {
    $prizeAgree.addClass('active');
    $(e.target)
      .parents('.dialog')
      .hide();
    $body.removeClass('of-hidden');
  },
});
