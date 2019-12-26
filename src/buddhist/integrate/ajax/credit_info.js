/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('creditsInfo', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/creditsInfo', '/src/buddhist/integrate/mock/creditsInfo'],
});
