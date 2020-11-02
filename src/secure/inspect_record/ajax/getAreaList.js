/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getAreaList', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/areaList/', '/src/secure/inspect_record/mock/getAreaList'],
});
