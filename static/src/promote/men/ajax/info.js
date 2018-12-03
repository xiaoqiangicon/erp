import seeAjax from 'see-ajax';

const refactor = {
  data: {
    promoteUrl: 'applyUrl',
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
