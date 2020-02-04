/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('save', {
  method: ['POST'],
  stringify: [!1],
  url: [
    '/zzhadmin/addorUpdateVolunteerActivity/',
    '/src/volunteer/create/mock/save',
  ],
});
