/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('insuranceEdit', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/insuranceeditGroup/',
    '/src/insurance/manage/mock/insurance_edit',
  ],
});
