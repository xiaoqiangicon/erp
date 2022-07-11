import seeAjax from 'see-ajax';
import './get_buddhist_list';
import './get_list';
import './get_printer_list';
import './get_printer_status';
import './handle_order';
import './print';
import './get_courier_company_list';
import './get_printer_config';
import './update_printer_config';
import './verfiy_express';
import handleAjaxError from '../../../com/handle-ajax-error';

seeAjax.setEnv(__SEE_ENV__); // eslint-disable-line no-undef

const postHandle = res => {
  res.success = res.result >= 0 || res.errorCode >= 0;
  res.message = res.msg || '未知错误，请稍后重试';

  handleAjaxError(res);
};

seeAjax.config('common', {
  postHandle: [postHandle, postHandle],
});
