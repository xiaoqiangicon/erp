/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {
  // orderIds: 'orderIds', // 数组
  // pics: 'pics', // 逗号分隔
  // remark: 'remark',
  // courierCompanyCode: 'courierCompanyCode',
  // logisticsOrder: 'logisticsOrder',
};

const pre = params => {
  params.pics = params.pics.join(',');
};

seeFetch.config('handleOrder', {
  method: ['post'],
  stringify: [!1],
  url: [
    '/zzhadmin/finishConversionOrder/',
    '/src/buddhist/chanzai_order/mock/success.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
