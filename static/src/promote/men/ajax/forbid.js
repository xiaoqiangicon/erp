import seeAjax from 'see-ajax';

const req = {
  id: 'userId',
};

const pre = params => ({ ...params, type: 3 });

seeAjax.config('forbid', {
  url: [
    '/zzhadmin/setPromotionUser/',
    '/static/src/promote/men/mock/forbid-1.json',
    '/static/src/promote/men/mock/forbid.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
