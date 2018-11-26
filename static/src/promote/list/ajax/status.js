import seeAjax from 'see-ajax';

const req = {
  id: 'commodityId',
  online: 'isPromotion',
};

seeAjax.config('status', {
  url: [
    '/zzhadmin/setIsPromotion/',
    '/static/src/promote/list/mock/status-1.json',
    '/static/src/promote/list/mock/status.json',
  ],
  req: [req, req],
});
