/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';
import util from '../../../../old-com/util/src';

const req = {
  status: 'type',
  search: 'number',
  time: 'date',
  page: 'pageNum',
};

const pre = params => ({
  ...params,
  commodityId: parseInt(util.urlParams.id, 10),
  pageNum: params.pageNum - 1,
  pageSize: 10,
});

const refactor = {
  totalCount: 'data.total',
  data: 'data.list',
  _data: [
    {
      title: 'name',
      time: 'payTime',
      salesmanName: 'userName',
      salesmanPhone: 'mobile',
      reward: 'promotionMoney',
      charge: 'serviceMoney',
      status: 'type',
    },
  ],
};

const post = res => {
  res.totalPages = Math.ceil((res.totalCount || 1) / 10);
  if (res.data && res.data.length)
    res.data.forEach(item => {
      item.statusFinished = item.status === 1;
      item.statusUnfinished = item.status === 2;
      item.statusUnhandled = item.status === 3;
    });
};

seeAjax.config('records', {
  url: [
    '/zzhadmin/promotionOrderList/',
    '/src/promote/manage/mock/records-1',
    '/src/promote/manage/mock/records',
  ],
  req: [req, req],
  pre: [pre, pre],
  refactor: [refactor, refactor],
  post: [
    post,
    post,
    res => {
      res.data.forEach(item => {
        item.statusFinished = item.status === 1;
        item.statusUnfinished = item.status === 2;
        item.statusUnhandled = item.status === 3;
      });
    },
  ],
});
