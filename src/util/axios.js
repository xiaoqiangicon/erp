import _promise from 'es6-promise';
import axios from 'axios';
import QS from 'qs';
import { Notification } from 'element-ui';

if (!window.Promise) window.Promise = _promise;

const instance = axios.create({
  timeout: 10000,
});

/**
 * Axios 请求实例简化版封装
 * @param { method, url, params }
 * @returns Promise
 */
export default (method = 'get', url = '', params = {}) => {
  let options = { method, url };
  if (method === 'get') {
    options.params = params;
  } else if (/put|post|patch/.test(method)) {
    options.data = QS.stringify(params);
  }

  return new Promise((resolve, reject) => {
    instance(options)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        Notification({
          title: '提示',
          message: `接口错误，请联系开发人员：url [ ${err.config.url} ], errorText [ ${err.message} ]`,
          duration: 0,
        });
        reject(err.data);
      });
  });
};
