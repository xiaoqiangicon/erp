/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const post = res => {
  res.data.forEach(item => {
    if (item.sex === 1) {
      item.sexStr = '男';
    } else {
      item.sexStr = '女';
    }
  });
};

seeAjax.config('userDetailList', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/userDetailList/',
    '/src/structrue/personel/mock/userDetailList',
  ],
  post: [post, post, post],
});
