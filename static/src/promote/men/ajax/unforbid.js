import seeAjax from 'see-ajax';

const pre = params => ({ ...params, type: 0 });

seeAjax.config('unforbid', {
  method: ['post'],
  url: [
    '/zzhadmin/setPromotionUser/',
    '/static/src/promote/men/mock/unforbid-1.json',
    '/static/src/promote/men/mock/unforbid.json',
  ],
  pre: [pre, pre],
});
