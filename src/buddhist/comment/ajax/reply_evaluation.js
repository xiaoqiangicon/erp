/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

seeAjax.config('replyEvaluation', {
  method: ['post'],
  stringify: [!0],
  url: [
    '/zzhadmin/replyEvaluation',
    '/src/buddhist/comment/mock/reply_evaluation',
  ],
});
