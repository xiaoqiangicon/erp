/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getCodeList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/getSuppliesCodeList/',
    '/src/finance/print/mock/getCodeList',
  ],
});
