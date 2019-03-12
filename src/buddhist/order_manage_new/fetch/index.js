import seeFetch from 'see-fetch';
import './get_buddhist_list';
import './get_list';
import './get_printer_list';
import './get_printer_status';
import './handle_order';
import './handle_single_order';
import './print';

seeFetch.setEnv(__SEE_ENV__); // eslint-disable-line no-undef

const postHandle = res => {
  res.success = res.result >= 0 || res.errorCode >= 0;
  res.message = res.msg || '未知错误，请稍后重试';
};

seeFetch.config('common', {
  postHandle: [postHandle, postHandle],
});
