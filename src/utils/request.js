import axios from 'axios';
import { Message, MessageBox } from 'element-ui';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000, // 请求超时时间
});

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    const success = res.result >= 0 || res.errorCode >= 0;

    if (!success) {
      MessageBox.alert(res.message || res.msg || '未知错误，请稍后重试');
      return Promise.reject(res);
    }
    return res;
  },
  error => {
    console.log(`err: ${error}`); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
