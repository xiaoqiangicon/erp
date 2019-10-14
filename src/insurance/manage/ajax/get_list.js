/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/insuranceGetReviewList/',
    '/src/insurance/manage/mock/get_list',
  ],
});
