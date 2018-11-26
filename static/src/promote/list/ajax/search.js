import seeAjax from 'see-ajax';

const req = {
  search: 'commodityName',
};

const refactor = {
  data: [
    {
      // todo: 缺少 added 字段
      title: 'name',
    },
  ],
};

seeAjax.config('search', {
  url: [
    '/zzhadmin/promotionSearchCommodityList/',
    '/static/src/promote/list/mock/search-1',
    '/static/src/promote/list/mock/search',
  ],
  req: [req, req],
  refactor: [refactor, refactor],
});
