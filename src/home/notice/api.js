import axios from 'util/axios';

export default {
  // 获取寺院推送信息列表
  getNoticeList: p => axios('get', '/common/getTempleMessageList/', p),
  // 更新单条推送信息为已读
  updateNoticeRead: p => axios('get', '/common/updateTempleMessageRead/', p),
  // 获取左侧菜单消息提示数量
  getMenuTipNum: p => axios('get', '/zzhadmin/orderNumGet/', p),
};
