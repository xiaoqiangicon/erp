/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

seeFetch.config('getPrinterList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getPrinterList',
    '/src/buddhist/order_manage_new/mock/get_printer_list.json',
  ],
});
