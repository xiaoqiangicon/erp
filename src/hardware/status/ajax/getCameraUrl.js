/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getCameraUrl', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/getCameraUrl/', '/src/hardware/status/mock/getCameraUrl'],
});
