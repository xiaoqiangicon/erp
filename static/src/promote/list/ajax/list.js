import seeAjax from 'see-ajax';

const req = {
  status: 'isFinish',
  page: 'pageNum',
};

const pre = params => ({ ...params, isFinish: params.isFinish - 1, pageNum: params.pageNum - 1, pageSize: 20 });

const refactor = {
  totalCount: 'data.total',
  data: 'data.list',
  _data: [
    {
      // todo: 缺 online, cover 字段
      title: 'name',
      count: 'totalJoinNum',
      profit: 'totalPromotionMoney',
    },
  ],
};

const post = res => {
  /* eslint-disable no-param-reassign */
  res.totalPages = Math.ceil((res.totalCount || 1) / 20);
};

seeAjax.config('list', {
  url: [
    '/zzhadmin/promotionCeremonyGetList/',
    '/static/src/promote/list/mock/list-1',
    '/static/src/promote/list/mock/list',
  ],
  req: [req, req],
  pre: [pre, pre],
  refactor: [refactor, refactor],
  post: [post, post],
});
