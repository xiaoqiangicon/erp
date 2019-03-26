/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const req = {
  // orderIdList: 'orderIdList',
  // printerIdList: 'printerIdList',
  // printNum: 'printNum',
  printQrcode: 'qrcodePrint',
  printTel: 'isPrintMobile',
};

seeAjax.config('print', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/printAppointOrder/',
    '/src/buddhist/order_manage/mock/success.json',
  ],
  req: [req, req],
});
