/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const req = {
  // printerId: 'printerId',
};

seeAjax.config('getPrinterStatus', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/getPrinterStatus/',
    '/src/buddhist/chanzai_order/mock/get_printer_status.json',
  ],
});
