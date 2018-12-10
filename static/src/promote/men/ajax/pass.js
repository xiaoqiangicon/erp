import seeAjax from 'see-ajax';

const pre = params => ({ ...params, type: 0 });

seeAjax.config('pass', {
  method: ['post'],
  url: [
    '/zzhadmin/setPromotionUser/',
    '/static/src/promote/men/mock/pass-1.json',
    '/static/src/promote/men/mock/pass.json',
  ],
  pre: [pre, pre],
});
