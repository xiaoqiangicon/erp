/* eslint-disable no-param-reassign, prefer-destructuring, no-nested-ternary */
import seeAjax from 'see-ajax';

seeAjax.config('del', {
  method: ['post', 'post', 'post'],
  stringify: [!0],
  url: [
    '/zzhadmin/delCoupon/',
    '/buddhist/coupon/mock/del',
    '/buddhist/coupon/mock/del',
  ],
});
