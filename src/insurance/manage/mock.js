export const get_list = {
  pageName: 1,
  msg: '成功',
  total: 128,
  data: [
    {
      id: 2019081209,
      total: 99,
      endTime: 20190827,
      insuranceNumber: 2328483,
      addTime: '2019-08-12 20:12',
    },
    {
      id: 2019081202,
      total: 99,
      endTime: '',
      insuranceNumber: '',
      addTime: '2019-08-12 20:12',
    },
    {
      id: 2019081203,
      total: 99,
      endTime: 20190827,
      insuranceNumber: 2328483,
      addTime: '2019-08-12 20:12',
    },
  ],
  result: 1,
};

const expireList = [];
for (let i = 0; i < 4; i++) {
  expireList.push({
    id: i,
    expireTime: '2019-09-12',
    insuranceNumber: `1234${i}`,
    addTime: '2019-09-11',
    status: 1,
    groupNumber: 1234,
    isNotice: 0,
    total: 23 + i,
    agreenTotal: 22,
    invalidTotal: 2,
    expireNum: 2,
  });
}
export const expire_list = {
  list: expireList,
  count: 1,
  msg: '成功',
  result: 0,
};

export const insurance_edit = {
  msg: '成功',
  result: 0,
};

export const insurance_edit_user_info = {
  msg: '成功',
  result: 0,
};
