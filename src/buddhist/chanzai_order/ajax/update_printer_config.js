/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('updatePrinterConfig', {
  method: ['post'],
  stringify: [!1],
  url: [
    '/zzhadmin/addConversionOrderPrinter/',
    '/src/buddhist/chanzai_order/mock/success.json',
  ],
});
