/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

seeAjax.config('list', {
  url: ['', '', '/static/src/promote/man/mock/list'],
  post: [
    undefined,
    undefined,
    res => {
      res.data.forEach(item => {
        item.statusGot = item.status === 1;
        item.statusPending = item.status === 2;
        item.statusUnhandled = item.status === 3;
      });
    },
  ],
});
