/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

// 获取打印机配置列表 由于设置时 没有针对选择的打印机进行设置 因此 返回的列表内 配置都是一样的

const refactor = {
  data: [
    {
      printerId: 'id',
      printNum: 'continuousPrintNum',
      printQrcode: 'qrcodePrint',
      printTel: 'isPrintMobile',
    },
  ],
};

seeAjax.config('getPrinterConfig', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getConversionOrderPrinter/',
    '/src/buddhist/chanzai_order/mock/get_printer_config.json',
  ],
  refactor: [refactor, refactor],
});
