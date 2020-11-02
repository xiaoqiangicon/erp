/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('update', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/updateManagerUserInfo/',
    '/src/structrue/personel/mock/update',
  ],
});
