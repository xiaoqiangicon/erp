import seeAjax from 'see-ajax';

const req = {
  reason: 'content',
};

const pre = params => ({ ...params, type: 2 });

seeAjax.config('refuse', {
  url: [
    '/zzhadmin/setPromotionUser/',
    '/static/src/promote/men/mock/refuse-1.json',
    '/static/src/promote/men/mock/refuse.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
