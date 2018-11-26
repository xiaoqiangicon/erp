/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

const req = {
  // status: '', // todo: 这个参数接口给的有问题
  search: 'number',
  time: 'date',
  page: 'pageNum',
};

const pre = params => ({ ...params, pageNum: params.pageNum - 1, pageSize: 20 });

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
  res.totalPages = Math.ceil((res.totalCount || 1) / 20);
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
    '/static/src/promote/manage/mock/records-1',
    '/static/src/promote/manage/mock/records',
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
