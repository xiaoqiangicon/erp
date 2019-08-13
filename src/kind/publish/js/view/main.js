const $ = require('jquery');
const seeView = require('see-view').default;
const seeAjax = require('see-ajax').default;

seeView({
  events: {
    'click .header-item': 'onClickHeaderItem',
    'click .push-select': 'onClickSelect',
  },
  onClickHeaderItem: e => {
    $this = $(e.target);

    $this
      .addClass('header-item-active')
      .siblings()
      .removeClass('header-item-active');
  },
  onClickSelect: e => {
    $this = $(e.target);

    $this
      .addClass('push-select-active')
      .siblings()
      .removeClass('push-select-active');
  },
});
