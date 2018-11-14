/**
 *Create by kang on 2018/11/13.
 */

import seeAjax from 'see-ajax';

seeAjax.config('deleteMyBuddhistTemplate', {
  method: ['get', 'get'],
  stringify: [false, false],
  url: ['/zzhadmin/templateTypeList//', '/static/src/buddhist/common/mock/success'],
});
