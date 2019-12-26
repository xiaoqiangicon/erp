/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const post = res => {};

seeAjax.config('getList', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/getMissionList', '/src/buddhist/integrate/mock/list'],
  post: [post, post],
});
