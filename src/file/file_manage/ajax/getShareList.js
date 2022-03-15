/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getShareList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/managerFileShareUserList/',
    '/src/file/file_manage/mock/getShareList',
  ],
});
