/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getList', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/insuranceGroupList/', '/src/insurance/manage/mock/get_list'],
});
