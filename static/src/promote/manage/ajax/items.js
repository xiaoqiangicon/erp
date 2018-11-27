/* eslint-disable no-param-reassign */
import seeAjax from 'see-ajax';
import util from '@zzh/util';

const pre = params => ({ ...params, commodityId: parseInt(util.urlParams.id, 10), pageNum: 0, pageSize: 1000 });

const refactor = {
  data: 'data.list',
  _data: [
    {
      title: 'name',
      cover: 'pic',
    },
  ],
};

const post = res => {
  res.data.forEach(item => {
    item.priceText = item.price;
    item.noNeedPay = !1;
    if (item.priceType === 2) {
      item.priceText = '无需支付';
      item.noNeedPay = !0;
    } else if (item.priceType === 3) item.priceText = '随喜';

    item.chargeText = item.charge;
    if (!item.hasCharge) item.chargeText = '-';
    else if (item.chargeType === 1) item.chargeText = `支付价格*${item.charge}%`;

    item.rewardText = item.reward;
    if (item.rewardType === 1) item.rewardText = `支付价格*${item.reward}%`;
  });
};

const postLocal = res => {
  res.data.forEach(item => {
    item.priceText = item.price;
    item.noNeedPay = !1;
    if (item.priceType === 2) {
      item.priceText = '无需支付';
      item.noNeedPay = !0;
    } else if (item.priceType === 3) item.priceText = '随喜';

    item.chargeText = item.charge;
    if (!item.hasCharge) item.chargeText = '-';
    else if (item.chargeType === 1) item.chargeText = `支付价格*${item.charge}%`;

    item.rewardText = item.reward;
    if (item.rewardType === 1) item.rewardText = `支付价格*${item.reward}%`;
  });
};

// todo: 接口难以看懂
seeAjax.config('items', {
  url: [
    '/zzhadmin/promotionSubdivideList/',
    '/static/src/promote/manage/mock/items-1',
    '/static/src/promote/manage/mock/items',
  ],
  pre: [pre, pre],
  refactor: [refactor, refactor],
  post: [post, post, postLocal],
});
