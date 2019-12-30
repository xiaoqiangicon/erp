/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('creditsInfo', {
  method: ['get'],
  url: ['/zzhadmin/creditsInfo/', '/src/buddhist/integrate/mock/creditsInfo'],
});
