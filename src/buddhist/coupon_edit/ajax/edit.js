/* eslint-disable no-param-reassign, prefer-destructuring, no-nested-ternary */
import seeAjax from 'see-ajax';

seeAjax.config('save', {
  method: ['post', 'post', 'post'],
  url: [
    '/zzhadmin/editCoupon/',
    '/buddhist/coupon/mock/del',
    '/buddhist/coupon/mock/del',
  ],
});
