import seeAjax from 'see-ajax';
import handleAjaxError from '../../../com/handle-ajax-error';

const postHandle = res => {
  res.success = res.result >= 0;
  res.message = res.msg || '操作失败，请稍后再试';

  handleAjaxError(res);
};
seeAjax.config('common', {
  postHandle: [postHandle, postHandle],
});
