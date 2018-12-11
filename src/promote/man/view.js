import $ from 'jquery';
import seeView from 'see-view';
import { filter, requestList } from './util';

seeView({
  events: {
    '!click [data-status]': 'clickStatus',
  },
  clickStatus(e) {
    const $this = $(e.target);

    filter.status = parseInt($this.attr('data-status'), 10);
    $('#status').text($this.text());

    requestList();
  },
});
