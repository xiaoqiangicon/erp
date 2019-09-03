import $ from 'jquery';
import seeView from 'see-view';
seeView({
  events: {
    '!click [data-show-promotion]': 'onClickShowPromotion',
    'click [data-promotion-close]': 'onClickPromotionClose',
  },
  onClickShowPromotion: function(e) {
    $('#promotion').show();
  },
  onClickPromotionClose: function(e) {
    $(e.target)
      .parents('.promotion')
      .hide();
  },
});
