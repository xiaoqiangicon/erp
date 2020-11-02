/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('verifyManager', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/verifyManager/', '/src/structrue/verify/mock/verifyManager'],
});
