import seeAjax from 'see-ajax';

const postHandle = res => {
  res.success = res.result >= 0 || res.code >= 0;
  res.message = res.msg;
};

seeAjax.config('common', {
  postHandle: [postHandle, postHandle],
});
