/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {
  page: 'pageIndex',
  // pageSize: 'pageSize',
  // type: 'type',
  buddhistId: 'buddhistService',
  // subId: 'subId',
  hasFb: 'isSearchNoPic',
  notPrint: 'searchNotPrint',
  // beginDate: 'beginDate',
  // endDate: 'endDate',
  // tel: 'tel',
  // orderByPriceType: 'orderByPriceType', // 0 不起效 1 降 2 升
  // orderByTimeType: 'orderByTimeType',
};

const refactor = {
  totalCount: 'total',
  data: [
    {
      // customerName: 'customerName',
      // customerTel: 'customerTel',
      buyNum: 'buy_num',
      // productSumPrice: 'productSumPrice',
      // orderTime: 'orderTime',
      isPrint: 'is_print',
    },
  ],
};

seeFetch.config('getList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/ceremonyGetList',
    '/src/buddhist/order_manage_new/mock/get_list.json',
  ],
  req: [req, req],
  refactor: [refactor, refactor],
});
