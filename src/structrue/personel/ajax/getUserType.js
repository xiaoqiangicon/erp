/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getUserType', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/getManagerUserType/',
    '/src/structrue/personel/mock/getUserType',
  ],
});
