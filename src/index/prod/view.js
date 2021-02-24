import $ from 'jquery';
import seeView from 'see-view';

seeView({
  events: {
    'click #prompt': 'onClickPrompt',
    'click #close': 'onClickClose',
  },
  onClickPrompt() {
    $('#qr-box').removeClass('hide');
  },
  onClickClose() {
    $('#qr-box').addClass('hide');
  },
});
