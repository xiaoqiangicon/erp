import seeAjax from 'see-ajax';

const req = {
  id: 'commodityId',
};

const pre = params => ({ ...params, isPromotion: 1 });

seeAjax.config('add', {
  url: [
    '/zzhadmin/setIsPromotion/',
    '/static/src/promote/list/mock/add-1.json',
    '/static/src/promote/list/mock/add.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
