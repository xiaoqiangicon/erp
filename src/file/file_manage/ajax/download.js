/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('download', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/downloadManagerFile/',
    '/src/file/file_manage/mock/download',
  ],
});
