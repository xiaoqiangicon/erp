/* eslint-disable no-param-assign */
import seeAjax from 'see-ajax';

const req = {
  id: 'commodityId',
};

const pre = params => ({ ...params, isPromotion: 0 });

seeAjax.config('delete', {
  url: [
    '/zzhadmin/setIsPromotion/',
    '/static/src/promote/list/mock/delete-1.json',
    '/static/src/promote/list/mock/delete.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
