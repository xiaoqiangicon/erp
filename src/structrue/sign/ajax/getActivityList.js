/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const post = res => {
  res.data.list.forEach(item => {
    if (item.type === 1) {
      item.typeStr = '面部识别';
    } else {
      item.typeStr = '扫码签到';
    }
    item.deviceList = item.deviceList ? item.deviceList.split(',') : [];
  });
};

seeAjax.config('getActivityList', {
  method: ['post'],
  stringify: [!0],
  post: [post, post, post],
  url: [
    '/zzhadmin/getSignActivityList/',
    '/src/structrue/class/mock/getActivityList',
  ],
});
