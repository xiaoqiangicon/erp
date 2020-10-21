/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('share', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/shareManagerFile/', '/src/file/file_manage/mock/update'],
});
