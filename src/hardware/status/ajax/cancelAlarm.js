/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('cancelAlarm', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/cancelAlarm/', '/src/hardware/status/mock/cancelAlarm'],
});
