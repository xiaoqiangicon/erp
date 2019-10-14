import $ from 'jquery';
import * as orchids from 'orchids';
import Tippy from 'tippy';
import data from '../data';
import tpl from '../tpl';
import util from '../util';
orchids.registerPage(
  'detail',
  {
    created: function(param) {
      var self = this;
      self.$el = $(self.el);
      util.disableBodyScroll();
      var item = data.listItems[param.id];
      item.templeName = window.localStorage['templeName'];
      self.$el.html(tpl.detail.render(item));
      $('#detail-summary-right-unit').css({
        height: $('#detail-summary-left-unit').outerHeight(),
      });
    },
    destroyed: function() {
      util.enableBodyScroll();
    },
  },
  {
    backgroundColor: '#f5f5f5',
    direction: 'b2t',
    route: !1,
  }
);
