// 获取快递打印设置
// method: get
export const getPrintSetting = {
  result: 1,
  msg: 'OK',
  data: {
    id: 123456,
    // 用户Id
    user_id: 123456,
    // 快递公司客户编码
    partner_id: 'partner_id123',
    // 快递公司客户密钥
    partner_key: 'partner_id456',
    // 发件人姓名
    sender_name: '老江',
    // 发件人电话
    sender_phone: '12312312312',
    // 发件人省
    sender_province: '广东省',
    // 发件人市
    sender_city: '深圳市',
    // 发件人区
    sender_district: '南山区',
    // 发件人地址
    sender_address: '科技园',
    // 是否启用打印(1是 0否)
    enable_print: 1,
    // 删除标志(1是 0否)
    del_flag: 0,
  },
};

// 获取快递网点余额
// method: get
export const getPrintPartnerBalance = {
  result: 1,
  msg: 'OK',
  data: {
    // 快递网点余额
    partner_balance: 123321,
    // 最近的查询余额时间
    query_time: '2020-01-01 01:01:01',
  },
};

// 更新快递打印设置的合作方信息
// method: post
// params:
//   partner_id: 参考前面
//   partner_key: 参考前面
export const updatePrintSettingPartner = {
  result: 1,
  msg: 'OK',
  data: {
    // record
  },
};

// 更新快递打印设置的发送人信息
// method: post
// params:
//   sender_name: 参考前面
//   sender_phone: 参考前面
//   sender_province: 参考前面
//   sender_city: 参考前面
//   sender_district: 参考前面
//   sender_address: 参考前面
export const updatePrintSettingSender = {
  result: 1,
  msg: 'OK',
  data: {
    // record
  },
};

// 更新快递打印设置启用状态
// method: post
// params:
//   enable: 参考前面
export const updatePrintSettingEnable = {
  result: 1,
  msg: 'OK',
};

// 删除快递打印设置
// method: post
export const delPrintSetting = {
  result: 1,
  msg: 'OK',
};

// 清除快递打印设置的合作方信息
// method: post
export const removePrintSettingPartner = {
  result: 1,
  msg: 'OK',
};

// 获取快递打印设备列表
// method: get
// params:
//   page_num: default 1
//   page_size: default 10
export const getPrintDeviceList = {
  result: 1,
  msg: 'OK',
  data: {
    // 总数
    total: 99,
    // 当前列表
    list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
      id,
      // 用户Id
      user_id: id,
      // 设备编号
      device_num: `device_num ${id}`,
      // 设备名称
      device_name: `device_name ${id}`,
      // 删除标志(1是 0否)
      del_flag: 0,
      create_time: '2020-01-01 01:01:01',
    })),
  },
};

// 添加快递打印设备
// method: post
// params:
//   device_num: 参考前面
//   device_name: 参考前面
export const addPrintDevice = {
  result: 1,
  msg: 'OK',
  data: {
    // record
  },
};

// 删除快递打印设备
// method: post
// params:
//   id:
export const delPrintDevice = {
  result: 1,
  msg: 'OK',
  data: {
    // record
  },
};

// 获取快递打印设备硬件状态
// method: get
// params:
//   id:
export const getPrintDeviceStatus = {
  // -1为不在线
  result: [-1, 1][Math.floor(Math.random() * 2)],
  msg: 'OK',
};

// 打印佛事订单快递
// method: post
// params:
//   device_id: 设备Id
//   order_ids: 佛事订单Id，英文逗号分隔
export const printFoshiOrders = {
  result: 1,
  msg: 'OK',
};

// 获取所有的设备信息
// method: get
export const getAllPrintDevices = {
  result: 1,
  msg: 'OK',
  data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
    id,
    // 用户Id
    user_id: id,
    // 设备编号
    device_num: `device_num ${id}`,
    // 设备名称
    device_name: `device_name ${id}`,
    // 删除标志(1是 0否)
    del_flag: 0,
  })),
};

// 获取所有设备的任务信息
// method: get
export const getAllPrintDevicesWithTask = {
  result: 1,
  msg: 'OK',
  data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
    id,
    // 用户Id
    user_id: id,
    // 设备编号
    device_num: `device_num ${id}`,
    // 设备名称
    device_name: `device_name ${id}`,
    // 删除标志(1是 0否)
    del_flag: 0,
    // 当前任务总数
    total_count: 10 * id,
    // 完成数量
    finish_count: 2 * id,
    // 最新失败原因
    latest_fail_msg: 'oooooooo',
  })),
};

// 取消打印任务
// method: post
// params:
//   device_id: 设备Id
export const cancelPrintTask = {
  result: 1,
  msg: 'OK',
};

// 重新开始中断的打印任务
// method: post
// params:
//   device_id: 设备Id
export const restoreSuspendedPrintTask = {
  result: 1,
  msg: 'OK',
};

// 复打佛事订单快递
// method: post
// params:
//   order_id: 佛事订单Id
export const printAgainFoshiOrder = {
  result: 1,
  msg: 'OK',
};
