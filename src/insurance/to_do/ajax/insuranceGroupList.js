/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getInsuranceList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/insuranceGroupList/',
    '/src/insurance/to_do/mock/insurance_group_list',
  ],
});
