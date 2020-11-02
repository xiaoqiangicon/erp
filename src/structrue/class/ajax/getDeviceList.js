/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getDeviceList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/getZizaiCloudDeviceList/',
    '/src/structrue/class/mock/getDeviceList',
  ],
});
