/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getTempleActivity', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getTempleActivity',
    '/src/volunteer/create/mock/getTempleActivity',
  ],
});
