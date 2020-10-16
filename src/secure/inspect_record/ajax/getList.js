/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('areaRecordList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/areaRecordList/',
    '/src/secure/inspect_record/mock/areaRecordList',
  ],
});
