import seeAjax from 'see-ajax';

const req = {
  xuanZeIds: 'subdivideIds',
  foShiIds: 'commodityIds',
};

const pre = params => {
  const result = { ...params };

  if (result.rewardType === 1) {
    result.promotionMoney = -1;
    result.promotionPercentage = result.reward;
  } else {
    result.promotionMoney = result.reward;
    result.promotionPercentage = 0;
  }

  delete result.reward;
  delete result.rewardType;

  return result;
};

seeAjax.config('update', {
  url: [
    '/zzhadmin/setSubdividePromotion/',
    '/static/src/promote/manage/mock/update-1.json',
    '/static/src/promote/manage/mock/update.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
