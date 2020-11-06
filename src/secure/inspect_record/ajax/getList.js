/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const post = res => {
  res.data.list.forEach(item => {
    item.pic = item.pic ? item.pic.split(',') : [];
  });
};

seeAjax.config('areaRecordList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/areaRecordList/',
    '/src/secure/inspect_record/mock/areaRecordList',
  ],
  post: [post, post, post],
});
