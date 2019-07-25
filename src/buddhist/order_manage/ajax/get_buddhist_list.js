/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

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

seeAjax.config('getBuddhistList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getCommodityNameList',
    '/src/buddhist/order_manage/mock/get_buddhist_list.json',
  ],
  refactor: [refactor, refactor],
  post: [post, post],
});
