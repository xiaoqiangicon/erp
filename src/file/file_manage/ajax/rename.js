/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('rename', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/managerFileRename/', '/src/file/file_manage/mock/del'],
});
