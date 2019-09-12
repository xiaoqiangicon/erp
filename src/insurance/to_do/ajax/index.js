import seeAjax from 'see-ajax';
import './get_list';
import './insuranceAddToGroup';
import './insuranceGroupList';
import './insuranceEditUserInfo';

seeAjax.setEnv(__SEE_ENV__); // eslint-disable-line no-undef

const postHandle = res => {
  res.success = res.result >= 0 || res.errorCode >= 0;
  res.message = res.msg || '未知错误，请稍后重试';
  console.log(res);
};

seeAjax.config('common', {
  postHandle: [postHandle, postHandle],
});
