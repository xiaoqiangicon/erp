import seeAjax from 'see-ajax';
const postHandle = res => {
  res.success = res.result >= 0;
  res.message = res.msg || '操作失败，请稍后再试';
};
seeAjax.config('common', {
  postHandle: [postHandle, postHandle],
});
