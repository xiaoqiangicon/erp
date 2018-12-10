import seeAjax from 'see-ajax';

const pre = params => ({ ...params, type: 3 });

seeAjax.config('forbid', {
  method: ['post'],
  url: [
    '/zzhadmin/setPromotionUser/',
    '/static/src/promote/men/mock/forbid-1.json',
    '/static/src/promote/men/mock/forbid.json',
  ],
  pre: [pre, pre],
});
