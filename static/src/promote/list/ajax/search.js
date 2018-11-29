import seeAjax from 'see-ajax';

const req = {
  search: 'commodityName',
};

const refactor = {
  data: [
    {
      title: 'name',
      added: 'isPromotion',
    },
  ],
};

const post = res => {
  if (res.data && res.data.length && res.data.length > 4) res.data = res.data.slice(0, 4);
};

seeAjax.config('search', {
  url: [
    '/zzhadmin/promotionSearchCommodityList/',
    '/static/src/promote/list/mock/search-1',
    '/static/src/promote/list/mock/search',
  ],
  req: [req, req],
  refactor: [refactor, refactor],
  post: [post, post],
});
