/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

const req = {
  status: 'type',
  time: 'date',
  page: 'pageNum',
};

const pre = params => ({ ...params, isFinish: params.isFinish - 1, pageNum: params.pageNum - 1, pageSize: 20 });

const refactor = {
  totalCount: 'data.total',
  data: 'data.list',
  _data: [
    {
      time: 'payTime',
      title: 'name',
      amount: 'price',
      rewardRate: 'promotionPercentage',
      reward: 'promotionMoney',
      status: 'type',
    },
  ],
};

const post = res => {
  /* eslint-disable no-param-reassign */
  res.totalPages = Math.ceil((res.totalCount || 1) / 20);

  if (res.data && res.data.length)
    res.data.forEach(item => {
      item.statusGot = item.status === 1;
      item.statusPending = item.status === 2;
      item.statusUnhandled = item.status === 3;
    });
};

seeAjax.config('list', {
  url: [
    '/zzhadmin/getPromotionUserDetail/',
    '/static/src/promote/man/mock/list-1',
    '/static/src/promote/man/mock/list',
  ],
  req: [req, req],
  pre: [pre, pre],
  refactor: [refactor, refactor],
  post: [
    post,
    post,
    res => {
      res.data.forEach(item => {
        item.statusGot = item.status === 1;
        item.statusPending = item.status === 2;
        item.statusUnhandled = item.status === 3;
      });
    },
  ],
});
