/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {
  page: 'pageIndex',
  // pageSize: 'pageSize',
  // type: 'type',
  buddhistId: 'buddhistService',
  subId: 'subid',
  hasFb: 'isSearchNoPic',
  notPrint: 'searchNotPrint',
  // beginDate: 'beginDate',
  // endDate: 'endDate',
  // tel: 'tel',
  // orderByPriceType: 'orderByPriceType', // 0 不起效 1 降 2 升
  // orderByTimeType: 'orderByTimeType',
};

const refactor = {
  totalCount: 'total',
  data: [
    {
      buddhistName: 'productName', // 佛事名称

      customerName: 'customerName', // 联系人
      customerTel: 'customerTel', // 联系电话
      buyNum: 'buy_num', // 数量
      productSumPrice: 'productSumPrice', // 支付 等同于 price 此字段废弃
      orderTime: 'orderTime', // 下单时间
      isPrint: 'is_print', // 是否打印

      productSize: 'productSize', // 规格
      price: 'price', // 价格
      orderNumber: 'order_number', // 订单号
      outerOrderNumber: 'outer_order_number', // 外部订单号
      runningNumber: 'running_number', // 支付流水号

      qrcode: 'qrcode', // 二维码
      dispose_pic_url: 'dispose_pic_url', // 反馈图
      dispose_video_url: 'dispose_video_url', // 反馈视频
      ps: 'posiscript', // 附言 {type name value}

      user: {
        // 功德主信息 {name mobile}
        name: 'name',
        tel: 'mobile',
      },
    },
  ],
};

const post = res => {
  res.data.forEach(item => {
    item.images = item.dispose_pic_url ? item.dispose_pic_url.split(',') : [];
    item.videos = item.dispose_video_url
      ? item.dispose_video_url.split(',')
      : [];
  });
};

seeFetch.config('getList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/ceremonyGetList',
    '/src/buddhist/order_manage/mock/get_list.json',
  ],
  req: [req, req],
  post: [post, post],
  refactor: [refactor, refactor],
});
