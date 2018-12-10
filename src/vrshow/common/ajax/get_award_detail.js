/**
 *Create by kang on 2018/10/26.
 */

import seeAjax from 'see-ajax';

seeAjax.config('getAwardDetail', {
  method: ['post', 'post'],
  stringify: [false, false],
  url: ['/zzhadmin/vr_getSignGiftModel/', '/src/vrshow/common/mock/get_award_detail'],
});
