const dataList = [];
const singleList = {
  temple_id: 1,
  customerName: '麦一',
  orderTime: '2017-10-20 11:22:48',
  pay_type: 1,
  customerTel: '15019408112',
  age: 18,
  height: 173,
  nickName: '弘一',
  temple: '自在家',
  idCard: 362227192848391238,
  isMale: true,
  uId: 1234,
  reason: 'fjdkskfj',
};
for (let i = 0; i < 25; i++) {
  dataList.push(singleList);
}

export const get_list = {
  pageName: 1,
  msg: '成功',
  total: 128,
  data: dataList,
  result: 1,
};
