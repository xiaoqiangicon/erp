/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

seeAjax.config('records', {
  url: ['', '', '/static/src/promote/manage/mock/records'],
  post: [
    undefined,
    undefined,
    res => {
      res.data.forEach(item => {
        item.statusFinished = item.status === 1;
        item.statusUnfinished = item.status === 2;
        item.statusUnhandled = item.status === 3;
      });
    },
  ],
});
