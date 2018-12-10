/**
 *Create by kang on 2018/10/26.
 */

import seeAjax from 'see-ajax';

seeAjax.config('handleAward', {
  method: ['post', 'post'],
  stringify: [false, false],
  url: ['/zzhadmin/vr_dealSignGiftModel/', '/src/vrshow/common/mock/handle_award'],
});
