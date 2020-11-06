/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('save', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/addAndUpdateTempleInviteMessage/',
    '/src/structrue/personel/mock/save',
  ],
});
