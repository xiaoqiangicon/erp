import seeAjax from 'see-ajax';

const req = {
  receive: 'isRecruitPromotion',
  verify: 'isPromotionReview',
  title: 'recruitPromotionTitle',
  intro: 'recruitPromotionContent',
};

seeAjax.config('update', {
  method: ['post'],
  url: [
    '/zzhadmin/setTemplePromotion/',
    '/static/src/promote/set/mock/update-1.json',
    '/static/src/promote/set/mock/update.json',
  ],
  req: [req, req],
});
