/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const post = res => {
  res.data.list.forEach(item => {
    item.picList = item.checkPic ? item.checkPic.split(',') : [];
  });
};

seeAjax.config('foodRecordList', {
  method: ['post'],
  stringify: [!0],
  post: [post, post, post],
  url: ['/zzhadmin/foodRecordList/', '/src/secure/food/mock/foodRecordList'],
});
