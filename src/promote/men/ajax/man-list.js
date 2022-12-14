/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

const req = {
  page: 'pageNum',
};

const pre = params => {
  const result = { ...params, pageNum: params.pageNum - 1, pageSize: 10 };

  if (result.status === 0) result.type = 5;
  else if (result.status === 1) result.type = 0;
  else if (result.status === 2) result.type = 3;

  if (result.sortField === 'count') result.sortType = 6;
  else if (result.sortField === 'amount') result.sortType = 5;
  else if (result.sortField === 'totalAmount') result.sortType = 3;
  else result.sortType = 4;

  delete result.status;
  delete result.sortField;

  return result;
};

const refactor = {
  totalCount: 'data.total',
  data: 'data.list',
  _data: [
    {
      avatar: 'headImg',
      nickname: 'nickName',
      phone: 'mobile',
      count: 'payNum',
      amount: 'payMoney',
      totalAmount: 'promotionMoney',
      joinTime: 'addTime',
    },
  ],
};

const post = res => {
  res.totalPages = Math.ceil((res.totalCount || 1) / 10);
  if (res.data && res.data.length)
    res.data.forEach(item => {
      item.forbidden = item.status === 3;
      item.statusPending = item.status === 1;
      item.statusRefused = item.status === 2;
    });
};

seeAjax.config('man-list', {
  url: [
    '/zzhadmin/getPromotionUserList/',
    '/src/promote/men/mock/man-list-1',
    '/src/promote/men/mock/man-list',
  ],
  req: [req, req],
  pre: [pre, pre],
  refactor: [refactor, refactor],
  post: [
    post,
    post,
    res => {
      res.data.forEach(item => {
        item.statusPending = item.status === 1;
        item.statusRefused = item.status === 2;
      });
    },
  ],
});
