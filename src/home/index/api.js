import axios from 'util/axios';

export default {
  // 获取广告数据
  getAdInfo: p => axios('get', '/common/getErpAd/', p),
  // 点击推荐位广告上报
  clickAd: p => axios('get', '/common/clickAd/', p),
  // 获取左侧菜单消息提示数量
  getMenuTipNum: p => axios('get', '/zzhadmin/orderNumGet/', p),
};
