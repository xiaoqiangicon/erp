import seeAjax from 'see-ajax';

const req = {
  search: 'commodityName',
  page: 'pageNum',
};

const pre = params => ({ ...params, pageNum: params.pageNum - 1, pageSize: 4 });

const refactor = {
  totalCount: 'data.total',
  data: 'data.list',
  _data: [
    {
      title: 'name',
      added: 'isPromotion',
      needPay: 'isNeedPay',
    },
  ],
};

const post = res => {
  /* eslint-disable no-param-reassign */
  res.totalPages = Math.ceil((res.totalCount || 1) / 4);
};

seeAjax.config('search', {
  url: [
    '/zzhadmin/promotionSearchCommodityList/',
    '/src/promote/list/mock/search-1',
    '/src/promote/list/mock/search',
  ],
  req: [req, req],
  pre: [pre, pre],
  refactor: [refactor, refactor],
  post: [post, post],
});
