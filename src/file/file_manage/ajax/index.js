import seeAjax from 'see-ajax';
import handleAjaxError from '../../../com/handle-ajax-error';
import './getFileList';
import './getUserList';
import './download';
import './del';
import './rename';
import './shareFile';
import './getShareList';
import './saveFile';

seeAjax.setEnv(__SEE_ENV__); // eslint-disable-line no-undef

const postHandle = res => {
  res.success = res.result >= 0 || res.errorCode >= 0;
  res.message = res.msg || '未知错误，请稍后重试';

  handleAjaxError(res);
};

seeAjax.config('common', {
  postHandle: [postHandle, postHandle],
});
