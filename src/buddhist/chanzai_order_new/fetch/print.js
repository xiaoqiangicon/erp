/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {
  // orderIdList: 'orderIdList',
  // printerIdList: 'printerIdList',
  printNum: 'printNum',
  printQrcode: 'qrcodePrint',
  printTel: 'isPrintMobile',
};

seeFetch.config('print', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/printConversionOrder',
    '/src/buddhist/chanzai_order_new/mock/success.json',
  ],
  req: [req, req],
});
