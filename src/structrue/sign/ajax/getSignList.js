/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const post = res => {
  res.data.list.forEach(item => {
    if (item.type === 1) {
      item.signStr = '面部识别';
    } else {
      item.signStr = '扫码签到';
    }
  });
};

seeAjax.config('getList', {
  method: ['post'],
  stringify: [!0],
  post: [post, post, post],
  url: ['/zzhadmin/getSignList/', '/src/structrue/sign/mock/getList'],
});
