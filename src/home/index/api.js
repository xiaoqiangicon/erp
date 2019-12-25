import axios from 'util/axios';

export default {
  // 获取广告数据
  getAdInfo: p => axios('get', '/common/getErpAd', p),
};
