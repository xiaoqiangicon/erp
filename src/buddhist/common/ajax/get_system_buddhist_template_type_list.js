/**
 *Create by kang on 2018/11/13.
 */

import seeAjax from 'see-ajax';

seeAjax.config('getSystemBuddhistTemplateTypeList', {
  method: ['get', 'get'],
  stringify: [false, false],
  url: [
    '/zzhadmin/getCeremonyTemplateType/',
    '/src/buddhist/common/mock/get_system_buddhist_template_type_list',
  ],
});
