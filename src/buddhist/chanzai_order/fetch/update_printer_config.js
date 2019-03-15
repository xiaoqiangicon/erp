/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {
  printerList: 'printerSnList',
  _printerList: [
    {
      printerId: 'id',
      printNum: 'continuousPrintNum',
      printQrcode: 'qrcodePrint',
      printTel: 'isPrintMobile',
    },
  ],
};

seeFetch.config('updatePrinterConfig', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/addConversionOrderPrinter',
    '/src/buddhist/chanzai_order/mock/success.json',
  ],
  req: [req, req],
});
