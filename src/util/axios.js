import _promise from 'es6-promise';
import axios from 'axios';
import QS from 'qs';

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
        reject(err.data);
      });
  });
};
