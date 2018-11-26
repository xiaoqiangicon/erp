import seeAjax from 'see-ajax';

const req = {
  id: 'userId',
};

const pre = params => ({ ...params }); // todo: 缺少 type

seeAjax.config('unforbid', {
  url: [
    '/zzhadmin/setPromotionUser/',
    '/static/src/promote/men/mock/unforbid-1.json',
    '/static/src/promote/men/mock/unforbid.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
