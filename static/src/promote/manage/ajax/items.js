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
      needPay: 'isNeedPay', // 无需支付
      randomPay: 'isRandow', // 随喜
      charge: 'serviceMoney',
      reward: 'promotionPrice',
      promote: 'percent',
      isXuanZe: 'isSubdivide',
    },
  ],
};

const post = res => {
  res.data.forEach(item => {
    item.noNeedPay = !item.needPay;
    // 价格
    if (item.noNeedPay) {
      item.priceType = 2;
      item.priceText = '无需支付';
    } else if (item.randomPay) {
      item.priceType = 3;
      item.priceText = '随喜';
    } else {
      item.priceType = 1;
      item.priceText = item.price;
    }

    // 服务费
    item.hasCharge = item.charge > 0;
    item.chargeType = 1; // 后台只有比例

    item.chargeText = item.charge;
    if (!item.hasCharge || item.priceType === 2) item.chargeText = '-';
    else if (item.chargeType === 1) {
      if (item.priceType === 3) item.chargeText = `支付价格*${item.charge}%`;
      else if (item.priceType === 1) item.chargeText = parseFloat(((item.price * item.charge) / 100).toFixed(2));
    }

    // 分成
    item.rewardText = item.reward;
    item.hasReward = !0;
    if (item.promotionType === 1) item.rewardType = 2;
    else if (item.promotionType === 2) item.rewardType = 1;
    else item.hasReward = !1;

    if (!item.hasReward || item.priceType === 2) item.rewardText = '-';
    else if (item.rewardType === 1) {
      if (item.priceType === 3) item.rewardText = `支付价格*${item.reward}%`;
      else if (item.priceType === 1) item.rewardText = parseFloat(((item.price * item.reward) / 100).toFixed(2));
    }

    if (item.promote) item.promote = parseFloat((item.promote * 100).toFixed(2));

    // 推广费
    item.hasPromote = item.promote > 0;
    item.promoteType = 1; // 后台只有比例
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
