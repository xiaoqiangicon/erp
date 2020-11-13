/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('info', {
  method: ['get'],
  stringify: [!0],
  url: ['/zzhadmin/getTraffic', '/src/hardware/statistic/mock/info'],
});
