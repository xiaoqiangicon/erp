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
      buddhistId: 'id',
      buddhistName: 'name',
    },
  ],
};

const post = res => {
  res.data.forEach(item => {
    item.buddhistName = item.id + '-' + item.name;
  });
};

seeAjax.config('getBuddhistList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getConversionCommodityList',
    '/src/buddhist/chanzai_order/mock/get_buddhist_list.json',
  ],
  refactor: [refactor, refactor],
  post: [post, post],
});
