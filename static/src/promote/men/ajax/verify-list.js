/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

seeAjax.config('verify-list', {
  url: ['', '', '/static/src/promote/man/mock/verify-list'],
  post: [
    undefined,
    undefined,
    res => {
      res.data.forEach(item => {
        item.statusPending = item.status === 1;
        item.statusRefused = item.status === 2;
      });
    },
  ],
});
