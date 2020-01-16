/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';
import util from '../../../com-deprecated/util';

const req = {
  id: 'commodityId',
};

const pre = params => {
  params.commodityId = parseInt(util.urlParams.id, 10);

  if (params.online === 1) params.isPromotion = 1;
  else params.isPromotion = -1;

  delete params.online;
};

seeAjax.config('status', {
  url: [
    '/zzhadmin/setIsPromotion/',
    '/src/promote/list/mock/status-1.json',
    '/src/promote/list/mock/status.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
