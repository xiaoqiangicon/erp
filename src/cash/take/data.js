var data = {
  typeTexts: {
    0: ['提现中', '提现完成', '撤回', '待上传收据', '转账处理中', '收据不通过'],
    1: ['有疑问', '已回复疑问'],
  },
  lastStartDate: '',
  lastEndDate: '',
  currentHandleId: 0,
  listItems: {},
  filter: {
    startDate: '',
    endDate: '',
    status: 0,
  },
  accountStatus: globalData.accountStatus,
};
export default data;
