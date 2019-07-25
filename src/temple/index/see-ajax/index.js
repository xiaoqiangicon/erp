import seeAjax from 'see-ajax';
import './settings';
import './updateSettings';

seeAjax.setEnv(__SEE_ENV__); // eslint-disable-line no-undef
// seeAjax.setEnv(2);

const post = res => {
  res.success = res.result >= 0 || res.code >= 0;
  res.message = res.msg || '未知错误，请稍后重试';
};

seeAjax.config('common', {
  post: [post, post],
});
