/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

const req = {
  id: 'commodityId',
};

const pre = params => {
  if (params.online === 1) params.isPromotion = 1;
  else params.isPromotion = -1;

  delete params.online;
};

seeAjax.config('status', {
  url: [
    '/zzhadmin/setIsPromotion/',
    '/static/src/promote/list/mock/status-1.json',
    '/static/src/promote/list/mock/status.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
