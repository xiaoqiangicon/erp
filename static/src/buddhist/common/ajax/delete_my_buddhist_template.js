/**
 *Create by kang on 2018/11/13.
 */

import seeAjax from 'see-ajax';

seeAjax.config('deleteMyBuddhistTemplate', {
  method: ['post', 'post'],
  stringify: [true, true],
  url: ['/zzhadmin/delCeremonyTemplate/', '/static/src/buddhist/common/mock/success'],
});
