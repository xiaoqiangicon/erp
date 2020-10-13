/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getManagerList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/getManagerList/',
    '/src/structrue/personel/mock/getManagerList',
  ],
});
