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

seeAjax.config('search', {
  url: [
    '/zzhadmin/promotionSearchCommodityList/',
    '/src/promote/list/mock/search-1',
    '/src/promote/list/mock/search',
  ],
  req: [req, req],
  refactor: [refactor, refactor],
});
