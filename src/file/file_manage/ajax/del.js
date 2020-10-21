/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('del', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/delManagerFile/', '/src/file/file_manage/mock/del'],
});
