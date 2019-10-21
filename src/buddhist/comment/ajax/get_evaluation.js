/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('getEvaluationNum', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getEvaluationNum',
    '/src/buddhist/comment/mock/get_evaluation_num',
  ],
});
