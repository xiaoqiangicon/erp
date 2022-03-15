/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('cancelInvoice', {
  method: ['post'],
  url: [
    '/zzhadmin/cancelApplyInvoice/',
    '/src/cash/receipt/mock/cancelInvoice',
  ],
});
