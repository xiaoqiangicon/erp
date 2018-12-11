/**
 *Create by kang on 2018/11/13.
 */

import seeAjax from 'see-ajax';

seeAjax.config('getMyBuddhistTemplateList', {
  method: ['get', 'get'],
  stringify: [false, false],
  url: [
    '/zzhadmin/getCeremonyTemplateList/',
    '/src/buddhist/common/mock/get_my_buddhist_template_list',
  ],
});
