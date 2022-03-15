/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const typeStr = [
  '文物及陈列品',
  '图书文物',
  '文艺体育设备',
  '电子产品及通信设备',
  '交通及运输设备',
  '专用设备',
  '通用设备',
  '土地、房屋及构筑物',
  '家具及办公用具',
  '其他',
];
const sourceStr = ['购入', '自建', '接受捐赠', '租赁', '其他'];
const statusStr = ['正常', '损坏', '丢失', '领用租借'];

const post = res => {
  res.data.list.forEach(item => {
    item.typeStr = typeStr[item.type - 1];
    item.sourceStr = sourceStr[item.sourceType - 1];
    item.statusStr = statusStr[item.status];
    console.log(statusStr, item.status);
  });
};

seeAjax.config('getSupplyList', {
  method: ['post'],
  stringify: [!0],
  post: [post, post, post],
  url: ['/zzhadmin/getSuppliesList/', '/src/finance/supply/mock/getSupplyList'],
});
