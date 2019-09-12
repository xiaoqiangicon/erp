const dataList = [];
for (let i = 0; i < 25; i++) {
  dataList.push({
    id: `20140701${i}`,
    bonzeId: '法师表id',
    name: '法号',
    realName: '小强icon',
    idCard: '362227199512091203',
    idCardImgFront:
      'https://pic.zizaihome.com/826f865e-d99d-11e7-8d6d-00163e0c1e1c.png',
    idCardImgBack:
      'https://pic.zizaihome.com/826f865e-d99d-11e7-8d6d-00163e0c1e1c.png',
    sex: 1, // "0 男 1女",
    age: 18,
    height: '176（cm）',
    weight: '56kg',
    phone: '13756545456',
    templeName: '自在家',
    templePlace: '寺院省市区',
    templePlaceDetail: '寺院地区详细',
    proveImg:
      'https://pic.zizaihome.com/826f865e-d99d-11e7-8d6d-00163e0c1e1c.png',
    medicalHistory:
      '附近的是否可见拉萨大家国道经过覅我附近的是否可见拉萨大家国道经过覅我附近的是否可见拉萨大家国道经过覅我附近的是否可见拉萨大家国道经过覅我',
    groupId: '小组id',
    reason: '审核不通过原因或不续保原因',
    insuranceSign: '保险标识',
    InsurancePlan: '保险方案',
    remark: '备注',
    status: 0, // "1 审核中 0审核通过 2审核不通过",
    addTime: '20160701', // 添加时间,
    userId: '0794', // 用户id,
    isCarryOn: 1, // "1 同意续保"
    isNotice: 1, // 1已通知续保提醒
    expireTime: '20190821', // 保单到期时间
    insuranceNumber: 1243, // 保单号
  });
}

// 人员列表
export const get_list = {
  pageName: 1,
  msg: '成功',
  total: 128,
  data: dataList,
  result: 1,
};

// 分配表单
export const insurance_add_to_group = {
  msg: '成功',
  result: 0,
};

// 保单列表
const insuranceList = [];

for (let i = 0; i < 4; i++) {
  insuranceList.push({
    id: i,
    expireTime: '2019-09-13',
    insuranceNumber: '1234',
    addTime: '2019-09-12',
    status: 1,
    groupNumber: 'i',
    isNotice: 0,
    total: 10,
  });
}
export const insurance_group_list = {
  data: {
    list: insuranceList,
    count: 1,
    msg: '成功',
    result: 0,
  },
};

// 修改用户信息
export const insurance_edit_user_info = {
  msg: '成功',
  result: 0,
};

// 下载表格
export const insurance_download_list = {
  file: '不通过表单.xls',
};

// 上传表格
export const insurance_upload_list = {
  count: 1,
  result: 0,
};
