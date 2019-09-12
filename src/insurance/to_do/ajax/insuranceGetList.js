/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('insuranceGetList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/insuranceGetReviewListExcel/',
    '/src/insurance/to_do/mock/insurance_group_list',
  ],
});
