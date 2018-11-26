import seeAjax from 'see-ajax';

const req = {
  ids: 'subdivideIds',
  reward: 'promotionPercentage',
  // todo: 可能是金额
};

seeAjax.config('update', {
  url: [
    '/zzhadmin/setSubdividePromotion/',
    '/static/src/promote/manage/mock/update-1.json',
    '/static/src/promote/manage/mock/update.json',
  ],
  req: [req, req],
});
