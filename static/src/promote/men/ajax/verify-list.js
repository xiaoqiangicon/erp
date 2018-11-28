/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

const req = {
  page: 'pageNum',
};

const pre = params => {
  const result = { ...params, pageNum: params.pageNum - 1, pageSize: 20 };

  if (result.status === 0) result.type = 4;
  else if (result.status === 1) result.type = 1;
  else if (result.status === 2) result.type = 2;

  if (result.sortField === 'count') result.sortType = 1;
  else if (result.sortField === 'amount') result.sortType = 2;
  else result.sortType = 4;

  delete result.status;
  delete result.sortField;

  return result;
};

const refactor = {
  totalCount: 'data.total',
  pendingCount: 'data.waitNum',
  hasPromoteUrl: 'data.openPromotion',
  data: 'data.list',
  _data: [
    {
      avatar: 'headImg',
      nickname: 'nickName',
      phone: 'mobile',
      count: 'totalCount',
      amount: 'totalMoney',
      requestTime: 'addTime',
      status: 'type',
    },
  ],
};

const post = res => {
  res.totalPages = Math.ceil((res.totalCount || 1) / 20);
  if (res.data && res.data.length)
    res.data.forEach(item => {
      item.statusPending = item.status === 1;
      item.statusRefused = item.status === 2;
    });
};

seeAjax.config('verify-list', {
  url: [
    '/zzhadmin/getPromotionUserList/',
    '/static/src/promote/men/mock/verify-list-1',
    '/static/src/promote/men/mock/verify-list',
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
