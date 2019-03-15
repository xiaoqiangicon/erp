/* eslint-disable no-param-reassign, prefer-destructuring */
import seeFetch from 'see-fetch';

const req = {
  page: 'pageIndex',
  // pageSize: 'pageSize',
  // type: 'type', // 1 已完成 2 未处理 3 已发货
  buddhistId: 'buddishService',
  beginDate: 'startTime',
  endDate: 'endTime',
  tel: 'mobile',
};

const refactor = {
  totalCount: 'total',
  data: [
    {
      buddhistName: 'productName', // 佛事名称
      productImg: 'productImg', // 封面图
      customerName: 'customerName', // 联系人
      customerTel: 'customerTel', // 联系电话
      buyNum: 'buy_num', // 数量
      productSumPrice: 'productSumPrice', // 支付 等同于 price 此字段废弃
      orderTime: 'orderTime', // 下单时间
      isPrint: 'is_print', // 是否打印

      subName: 'productSize', // 选择项
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
    '/zzhadmin/getConversionOrderList',
    '/src/buddhist/chanzai_order_new/mock/get_list.json',
  ],
  req: [req, req],
  post: [post, post],
  refactor: [refactor, refactor],
});
