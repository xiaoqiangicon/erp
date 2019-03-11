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
};

const pre = params => ({
  ...params,
  // 添加排序规则 orderByPriceType orderByTimeType
});

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
  pre: [pre, pre],
  refactor: [refactor, refactor],
});
