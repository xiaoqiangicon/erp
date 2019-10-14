/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const postHandle = res => {
  res.data.forEach(item => {
    if (item.evaluation === 1) {
      item.evaluation = '很赞';
    } else if (item.evaluation === 2) {
      item.evaluation = '满意';
    } else {
      item.evaluation = '体验不佳';
    }
  });
};

seeAjax.config('getList', {
  method: ['get'],
  stringify: [!0],
  url: ['/zzhadmin/getEvaluationList', '/src/buddhist/comment/mock/get_list'],
  postHandle: [postHandle, postHandle, postHandle],
});
