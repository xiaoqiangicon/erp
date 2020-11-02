export const areaRecordList = {
  msg: '成功',
  result: 0,
  data: {
    total: 100,
    list: [
      {
        id: 1,
        managerName: '巡查人员名字',
        checkMemo: '巡查时发现的问题，非必填',
        checkPic: 'https://abc.jpg,https://111.jpg',
        addDate: '2020-01-01 12:12',
      },
    ],
  },
};

export const getUserList = {
  msg: '',
  result: 0,
  data: [
    {
      id: 1,
      name: '王大妈',
    },
    {
      id: 2,
      name: '李大妈',
    },
  ],
};

export const getAreaList = {
  msg: '成功',
  result: 0,
  data: {
    total: 100,
    list: [
      {
        id: 1,
        name: '巡查地点名',
        memo: '巡查注意事项',
        addDate: '2020-01-01 12:12',
      },
    ],
  },
};
