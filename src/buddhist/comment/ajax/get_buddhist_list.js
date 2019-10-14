/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getBuddhistList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getCommodityNameList',
    '/src/buddhist/comment/mock/get_buddhist_list',
  ],
});
