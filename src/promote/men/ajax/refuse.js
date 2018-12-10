import seeAjax from 'see-ajax';

const req = {
  reason: 'content',
};

const pre = params => ({ ...params, type: 2 });

seeAjax.config('refuse', {
  method: ['post'],
  url: [
    '/zzhadmin/setPromotionUser/',
    '/src/promote/men/mock/refuse-1.json',
    '/src/promote/men/mock/refuse.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
