/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getUserList', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/getManagerList/', '/src/file/file_manage/mock/getUserList'],
});
