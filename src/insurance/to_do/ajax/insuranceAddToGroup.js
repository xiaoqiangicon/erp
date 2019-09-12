/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('insuranceAddToGroup', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/insuranceAddToGroup/',
    '/src/insurance/to_do/mock/insurance_add_to_group',
  ],
});
