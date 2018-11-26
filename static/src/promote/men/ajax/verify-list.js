/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';

const req = {
  // todo: 参数不明
  page: 'pageNum',
};

const pre = params => ({ ...params, pageNum: params.pageNum - 1, pageSize: 20 });

const refactor = {
  totalCount: 'data.total',
  data: 'data.list',
  _data: [
    {
      // todo: 缺少 name, phone, requestTime, status 字段
      avatar: 'headImg',
      nickname: 'nickName',
      count: 'totalCount',
      amount: 'totalMoney',
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
