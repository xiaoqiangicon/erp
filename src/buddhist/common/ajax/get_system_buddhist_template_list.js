/**
 *Create by kang on 2018/11/13.
 */

import seeAjax from 'see-ajax';

seeAjax.config('getSystemBuddhistTemplateList', {
  method: ['get', 'get'],
  stringify: [false, false],
  url: [
    '/zzhadmin/ceremony_templateList/',
    '/src/buddhist/common/mock/get_system_buddhist_template_list',
  ],
});
