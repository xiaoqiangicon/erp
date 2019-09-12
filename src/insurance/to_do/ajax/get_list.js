/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const postHandle = (res, req) => {
  res.data.forEach(item => {
    item.sex = item.sex ? '女' : '男';
  });
};

seeAjax.config('getList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getConversionOrderList',
    '/src/insurance/to_do/mock/get_list',
  ],
  postHandle: [postHandle, postHandle],
});
