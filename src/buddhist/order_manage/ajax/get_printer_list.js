/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getPrinterList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getPrinterList/',
    '/src/buddhist/order_manage/mock/get_printer_list.json',
  ],
});
