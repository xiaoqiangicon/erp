/* eslint-disable no-param-reassign, prefer-destructuring */
import seeAjax from 'see-ajax';

const req = {
  page: 'pageIndex',
  // pageSize: 'pageSize',
  // type: 'type', // 1 已处理 2 未处理 3 已发货 4 已收货
  buddhistId: 'commodityId',
  beginDate: 'startTime',
  endDate: 'endTime',
  tel: 'mobile',
  // logisticsOrder: 'logisticsOrder',
};

const refactor = {
  totalCount: 'total',
  data: [
    {
      buddhistName: 'name', // 佛事名称
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

const pre = params => {
  params.pageIndex -= 1;
  if (params.commodityId === '') {
    params.commodityId = 0;
  }
};

const post = res => {
  res.data.forEach(item => {
    item.images = item.dispose_pic_url ? item.dispose_pic_url.split(',') : [];
    item.videos = item.dispose_video_url
      ? item.dispose_video_url.split(',')
      : [];
    item.refundMessageJSON = item.refundMessageJSON
      ? JSON.parse(item.refundMessageJSON)
      : {};
  });
};

seeAjax.config('getList', {
  method: ['get'],
  stringify: [!0],
  url: [
    '/zzhadmin/getConversionOrderList',
    '/src/buddhist/chanzai_order/mock/get_list.json',
  ],
  req: [req, req],
  pre: [pre, pre],
  post: [post, post],
  refactor: [refactor, refactor],
});
