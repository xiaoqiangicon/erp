/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('saveFile', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/saveManagerFile/', '/src/file/file_manage/mock/del'],
});
