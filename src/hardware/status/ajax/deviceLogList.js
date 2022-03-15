/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const post = res => {};

seeAjax.config('getDeviceLogList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/deviceAlarmLogList/',
    '/src/hardware/status/mock/deviceLogList',
  ],
  post: [post, post, post],
});
