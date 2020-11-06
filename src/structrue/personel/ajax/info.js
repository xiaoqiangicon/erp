/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('info', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/templeInfo/', '/src/structrue/personel/mock/info'],
});
