/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

seeAjax.config('man-list', {
  url: ['', '', '/static/src/promote/men/mock/man-list'],
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
