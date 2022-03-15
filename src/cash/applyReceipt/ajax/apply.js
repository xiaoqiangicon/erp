/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('apply', {
  method: ['post'],
  url: ['/zzhadmin/applyInvoice/', '/src/cash/receipt/mock/apply'],
});
