/* eslint-disable no-param-reassign, prefer-destructuring, no-nested-ternary */
import seeAjax from 'see-ajax';

seeAjax.config('list', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getCouponList/',
    '/src/buddhist/coupon/mock/list',
    '/src/buddhist/coupon/mock/list',
  ],
});
