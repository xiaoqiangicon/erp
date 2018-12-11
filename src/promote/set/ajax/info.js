import seeAjax from 'see-ajax';

const refactor = {
  data: {
    receive: 'isRecruitPromotion',
    verify: 'isPromotionReview',
    title: 'recruitPromotionTitle',
    intro: 'recruitPromotionContent',
    promoteUrl: 'applyUrl',
  },
};

seeAjax.config('info', {
  url: [
    '/zzhadmin/getTemplePromotion/',
    '/src/promote/set/mock/info-1.json',
    '/src/promote/set/mock/info.json',
  ],
  refactor: [refactor, refactor],
});
