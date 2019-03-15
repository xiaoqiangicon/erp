/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {
  // printerId: 'printerId',
};

seeFetch.config('getPrinterStatus', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/getPrinterStatus/',
    '/src/buddhist/chanzai_order_new/mock/get_printer_status.json',
  ],
});
