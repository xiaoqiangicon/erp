/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('insuranceEditUserInfo', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/insuranceEditUserInfo/',
    '/src/insurance/to_do/mock/insurance_edit_user_info',
  ],
});
