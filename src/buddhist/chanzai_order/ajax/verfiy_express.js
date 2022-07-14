/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('verifyExpress', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/verifyExpress/',
    '/src/buddhist/chanzai_order/mock/verifyExpress.json',
  ],
});
