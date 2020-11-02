/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const post = res => {
  res.data.forEach(item => {
    item.statusStr = item.status === 0 ? '正常' : '离线';
  });
};

seeAjax.config('getDeviceList', {
  method: ['post'],
  stringify: [!0],
  url: ['/zzhadmin/getDeviceList/', '/src/hardware/status/mock/getDeviceList'],
  post: [post, post, post],
});
