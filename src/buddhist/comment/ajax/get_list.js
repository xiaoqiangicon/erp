/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getList', {
  method: ['get'],
  stringify: [!0],
  url: ['/zzhadmin/getEvaluationList', '/src/buddhist/comment/mock/get_list'],
});
