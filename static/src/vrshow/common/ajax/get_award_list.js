/**
 *Create by kang on 2018/10/26.
 */

import seeAjax from 'see-ajax';

seeAjax.config('getAwardList', {
  method: ['post', 'post'],
  stringify: [false, false],
  url: ['/zzhadmin/vr_getSignGiftList/', '/static/src/vrshow/common/mock/get_award_list'],
});
