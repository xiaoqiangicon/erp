import seeAjax from 'see-ajax';

const req = {
  id: 'userId',
};

const pre = params => ({ ...params, type: 0 });

seeAjax.config('pass', {
  url: [
    '/zzhadmin/setPromotionUser/',
    '/static/src/promote/men/mock/pass-1.json',
    '/static/src/promote/men/mock/pass.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
