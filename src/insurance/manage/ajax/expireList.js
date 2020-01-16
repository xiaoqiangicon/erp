/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('expireList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/insuranceExpireGroupList/',
    '/src/insurance/manage/mock/expire_list',
  ],
});
