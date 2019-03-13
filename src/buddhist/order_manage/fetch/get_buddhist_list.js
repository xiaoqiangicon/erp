/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

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
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getCommodityNameList',
    '/src/buddhist/order_manage/mock/get_buddhist_list.json',
  ],
  refactor: [refactor, refactor],
  post: [post, post],
});
