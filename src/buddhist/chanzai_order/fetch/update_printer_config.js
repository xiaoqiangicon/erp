/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

seeFetch.config('updatePrinterConfig', {
  method: ['post'],
  stringify: [!1],
  url: [
    '/zzhadmin/addConversionOrderPrinter/',
    '/src/buddhist/chanzai_order/mock/success.json',
  ],
});
