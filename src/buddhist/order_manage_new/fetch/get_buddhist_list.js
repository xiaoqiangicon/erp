/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {};

const refactor = {
  data: [
    {
      subList: 'subdivideList',
      _subList: [
        {
          subName: 'name',
          subId: 'subdivideId',
        },
      ],
      buddhistId: 'commodityId',
      buddhistName: 'name',
    },
  ],
};

const post = res => {
  if (res.data)
    res.data.forEach(item => {
      item.cover = item.giftPic.split(',')[0];
    });
};

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
