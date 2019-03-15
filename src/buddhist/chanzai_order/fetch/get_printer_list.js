/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

seeFetch.config('getPrinterList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getPrinterList',
    '/src/buddhist/chanzai_order/mock/get_printer_list.json',
  ],
});
