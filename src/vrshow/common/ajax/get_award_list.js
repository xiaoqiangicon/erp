/**
 *Create by kang on 2018/10/26.
 */

import seeAjax from 'see-ajax';

const postHandle = res => {
  res.data.forEach(item => {
    /* eslint-disable no-param-reassign */
    item.key = item.id;
  });
};

seeAjax.config('getAwardList', {
  method: ['post', 'post'],
  stringify: [false, false],
  url: [
    '/zzhadmin/vr_getSignGiftList/',
    '/src/vrshow/common/mock/get_award_list',
  ],
  postHandle: [postHandle, postHandle],
});
