/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {
  // printerId: 'printerId',
};

seeFetch.config('getPrinterStatus', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/getPrinterList',
    '/src/buddhist/order_manage_new/mock/get_printer_status.json',
  ],
  req: [req, req],
});
