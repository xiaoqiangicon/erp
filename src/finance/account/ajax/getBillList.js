/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const post = res => {
  res.data.list.forEach(item => {
    item.typeStr = item.type === 1 ? '支出' : '收入';
  });
};

seeAjax.config('getBillList', {
  method: ['post'],
  stringify: [!0],
  post: [post, post, post],
  url: [
    '/zzhadmin/getManagerBillList/',
    '/src/finance/account/mock/getBillList',
  ],
});
