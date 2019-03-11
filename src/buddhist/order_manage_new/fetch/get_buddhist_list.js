/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {};

const refactor = {
  data: [
    {
      subdivideList: [
        {
          subName: 'name',
          subId: 'subdivideId',
        },
      ],
      subList: 'subdivideList',
      buddhistId: 'commodityId',
      buddhistName: 'name',
    },
  ],
};

const post = res => {};

seeFetch.config('getBuddhistList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/getCommodityNameList',
    '/src/buddhist/order_manage_new/mock/get_buddhist_list.json',
  ],
  req: [req, req],
  refactor: [refactor, refactor],
  post: [post, post],
});
