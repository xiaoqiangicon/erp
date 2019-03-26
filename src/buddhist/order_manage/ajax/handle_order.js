/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

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

seeAjax.config('handleOrder', {
  method: ['post'],
  stringify: [!1],
  url: [
    '/zzhadmin/finishMoreOrder/',
    '/src/buddhist/order_manage/mock/success.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
