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
    partner_id: '',
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
    // 模板类型(1 标准模板、2 有二维码的模板)
    template_type: 2,
    // 顺丰速运月结账号
    sf_partner_id: 'sf_partner_id111',
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

// 更新快递打印设置模板类型
// method: post
// params:
//   template_type: 参考前面
export const updatePrintSettingTemplateType = {
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

// 获取快递打印手动打印列表
// method: get
// params:
//   page_num: default 1
//   page_size: default 10
//   print_status: default 0，打印状态（0 全部、1 待打印、2 已打印）
//   search_type: 搜索类型（1 电话号码、2 收件人姓名、3 物品名称、4 自在家单号、5 物流单号）
//   search_key: 搜索关键字
//   start_create_time: 创建时间起始
//   end_create_time: 创建时间结束
//   start_print_time: 打印时间起始
//   end_print_time: 打印时间结束
//   sort_field: 排序字段（create_time, print_time）
//   sort_type: 排序类型 asc, desc
export const getPrintManualList = {
  result: 1,
  msg: 'OK',
  data: {
    // 总数
    total: 99,
    all_total: 91,
    // 当前列表
    list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
      id,
      // 用户Id
      user_id: id,
      // 收件人姓名
      receiver_name: '老江' + id,
      // 收件人电话
      receiver_phone: '12312312312' + id,
      // 收件人省
      receiver_province: '广东省' + id,
      // 收件人市
      receiver_city: '深圳市' + id,
      // 收件人区
      receiver_district: '南山区' + id,
      // 收件人地址
      receiver_address: '科技园' + id,
      // 物品名称
      goods_name: '物品名称' + id,
      // 物品数量
      goods_quantity: 123 + id,
      // 备注
      remark: '备注' + id,
      // 佛事订单Id，多个用英文逗号分隔
      foshi_order_ids: '123,456' + id,
      // 快递公司编码，与佛事订单一致
      express_company_code: 'YTO',
      // 快递单号
      express_num: 'hahahah' + id,
      // 状态(0 未打印、1 正在打印、2 打印成功、3 打印失败、9 添加打印失败)
      print_status: id % 4,
      // 打印快递单的任务Id(快递100)
      print_task_id: 'qwe' + id,
      // 打印备注信息
      print_message: 'qwe' + id,
      // 打印时间
      print_time: '2020-01-01 01:01:01',
      // 删除标志(1是 0否)
      del_flag: 0,
      create_time: '2020-01-01 01:01:01',
    })),
  },
};

// 添加快递打印手动打印
// method: post
// params:
//   receiver_name: 参考前面
//   receiver_phone: 参考前面
//   receiver_province: 参考前面
//   receiver_city: 参考前面
//   receiver_district: 参考前面
//   receiver_address: 参考前面
//   goods_name: 参考前面
//   goods_quantity: 参考前面
//   remark: 参考前面
//   foshi_order_ids: 参考前面
export const addPrintManual = {
  result: 1,
  msg: 'OK',
  data: {
    // record
  },
};

// 批量添加快递打印手动打印
// method: post
// params:
//   content: JSON [{param}]
export const addPrintManualBatch = {
  result: 1,
  msg: 'OK',
  data: {
    // record
  },
};

// 更新快递打印手动打印
// method: post
// params:
//   id:
//   receiver_name: 参考前面
//   receiver_phone: 参考前面
//   receiver_province: 参考前面
//   receiver_city: 参考前面
//   receiver_district: 参考前面
//   receiver_address: 参考前面
//   goods_name: 参考前面
//   goods_quantity: 参考前面
//   remark: 参考前面
//   foshi_order_ids: 参考前面
export const updatePrintManual = {
  result: 1,
  msg: 'OK',
  data: {
    // record
  },
};

// 删除快递打印手动打印
// method: post
// params:
//   id:
export const delPrintManual = {
  result: 1,
  msg: 'OK',
  data: {
    // record
  },
};

// 打印手动打印
// method: post
// params:
//   device_id: 设备Id
//   manual_ids: 记录Id，英文逗号分隔
export const printManual = {
  result: 1,
  msg: 'OK',
};

// 复打手动打印记录
// method: post
// params:
//   manual_id: 记录Id
export const printAgainManual = {
  result: 1,
  msg: 'OK',
};
