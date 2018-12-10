import seeAjax from 'see-ajax';

const req = {
  xuanZeIds: 'subdivideIds',
  foShiIds: 'commodityIds',
};

const pre = params => {
  const result = { ...params };

  if (result.rewardType === 1) {
    result.promotionMoney = 0;
    result.promotionPercentage = result.reward;
  } else {
    result.promotionMoney = result.reward;
    result.promotionPercentage = -1;
  }

  delete result.reward;
  delete result.rewardType;

  return result;
};

seeAjax.config('update', {
  url: [
    '/zzhadmin/setSubdividePromotion/',
    '/src/promote/manage/mock/update-1.json',
    '/src/promote/manage/mock/update.json',
  ],
  req: [req, req],
  pre: [pre, pre],
});
