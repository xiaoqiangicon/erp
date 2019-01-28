/**
 * Created by senntyou on 2017/3/29.
 */

define(function() {
  var data = {
    typeTexts: {
      0: [
        '提现中',
        '提现完成',
        '撤回',
        '待上传收据',
        '转账处理中',
        '收据不通过',
      ],
      1: ['有疑问', '已回复疑问'],
    },
    // 最近更新开始时间
    lastStartDate: '',
    // 最近更新结束时间
    lastEndDate: '',
    // 当前正在处理的ID
    currentHandleId: 0,
    // 订单数据
    listItems: {
      // id -> {}
    },
    // 分页过滤条件
    filter: {
      // 开始时间
      startDate: '',
      // 结束时间
      endDate: '',
      // 状态
      status: 0,
    },
    // -1 未添加账户信息 0 待审核 1 审核通过 2 审核不通过
    accountStatus: globalData.accountStatus,
  };

  return data;
});
