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
      title: 'name',
      cover: 'pic',
      count: 'totalJoinNum',
      profit: 'totalPromotionMoney',
      ended: 'isEnd',
    },
  ],
};

const post = res => {
  /* eslint-disable no-param-reassign */
  res.totalPages = Math.ceil((res.totalCount || 1) / 20);

  if (res.data && res.data.length)
    res.data.forEach(item => {
      item.online = item.isPromotion === 1;
      item.showDelete = !item.online && !item.ended;
    });
};

seeAjax.config('list', {
  url: [
    '/zzhadmin/promotionCeremonyGetList/',
    '/src/promote/list/mock/list-1',
    '/src/promote/list/mock/list',
  ],
  req: [req, req],
  pre: [pre, pre],
  refactor: [refactor, refactor],
  post: [post, post],
});
