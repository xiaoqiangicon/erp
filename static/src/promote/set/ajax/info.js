import seeAjax from 'see-ajax';

const refactor = {
  data: {
    receive: 'isRecruitPromotion',
    verify: 'isPromotionReview',
    title: 'recruitPromotionTitle',
    intro: 'recruitPromotionContent',
  },
};

seeAjax.config('info', {
  url: [
    '/zzhadmin/getTemplePromotion/',
    '/static/src/promote/set/mock/info-1.json',
    '/static/src/promote/set/mock/info.json',
  ],
  refactor: [refactor, refactor],
});
