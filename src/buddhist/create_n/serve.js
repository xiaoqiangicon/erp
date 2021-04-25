const createdData = {
  // 是否已结束
  isEnd: 0,
  // 是否显示参与者列表
  showClient: 1,
  // 目标筹款金额
  targetAmount: 0,
  // 当前Id
  id: 9093,
  // 标题
  title: '2021浴佛节领奖一-邮寄',
  // 无用字段
  explain: '',
  // 详情
  detail: '<p>的的萨芬</p>',
  // 下单按钮文字
  opName: '随喜功德',
  // 是否显示统计区域
  showStatictics: 1,
  // 库存（-1为无限制）
  stock: -1,
  // 状态（0 进行中，1 未开始，2 草稿，-1 删除）
  status: 0,
  // 是否显示剩余时间
  showEndTime: 0,
  // 是否显示分享标题参与人次
  allow_showVistNum: 1,
  // 价格（无规格时）
  price: '',
  // 开始时间
  startTime: '2021-04-19 11:55:39',
  // 反馈类型（1 通用法会，2 通用捐赠，3 供养万僧，...）
  feedbackType: 1,
  // 分类Id
  ceremonyTypeId: 82,
  // 简介
  custom_introduce: '',
  // 无用字段
  isPrintMobile: 0,
  // 是否显示反馈信息
  pay_succ_details_flag: 0,
  // 封面图
  pics: [
    'https://pic.zizaihome.com/9e286110-725a-11ea-973a-00163e0c1e1c.jpg?imageMogr/auto-orient',
  ],
  // 公共附言
  postScript: [],
  // 是否自动处理订单
  isAutoFinish: 0,
  // 结束时间
  endTime: '2099-12-31 00:00:00',
  // 支付成功反馈信息
  payDetail:
    '<section><section style="margin: 10px auto;"><section style="border-style: solid;-webkit-border-image: url(http://mpt.135editor.com/mmbiz_png/yqVAqoZvDibGpfYS2cC4YzbozH31oekibOFPBxA1CDIwaGogibNAnYBrrLIvt9q2U2RhpJruHxyI9YyMStIK84ibgw/0?wx_fmt=png) 65 fill;border-width: 20px;padding: 5px;color:#feda8c;"><p style="text-align: center;"><span style="font-size: 24px; caret-color: red;"><br/></span></p><p style="text-align: center;"><span style="font-size: 24px; caret-color: red;">随喜赞叹，功德无量。</span></p><p style="text-align: center;"><span style="font-size: 24px; caret-color: red;">福慧双增，所愿皆遂。</span></p><p><span style="font-size: 24px; caret-color: red;"><br/></span></p></section></section></section>',
  // 规格
  subdivideStr: [
    {
      // 规格的排序
      sort: 0,
      // 打印机
      printer: [
        {
          // 打印机Id
          printerId: 2,
          // 打印联数 1-5
          continuousPrintNum: 3,
          // 是否打印电话号码
          isPrintMobile: 1,
          // 是否打印二维码（1 全部打印，2 隔联打印，3 不打印）
          qrcodePrint: 1,
        },
      ],
      // 规格名称
      name: '开运红绳',
      /**
       * 金额类型
       * 1: 普通佛事
       * 2: 往生牌位
       * 3: 祈福牌位
       * 4: 邮寄佛事
       */
      subdivide_type: 4,
      // 价格
      price: 0,
      // 封面
      pic: 'https://pic.zizaihome.com/56a2d8c6-f49a-4b13-b749-58c4f540dc11.jpg',
      // 是否是转单
      conversionSubdivide: 0,
      // 附言
      postScript: [
        {
          // 名称
          name: '普通邮寄',
          /**
           * 最大图片数量（图片上传组件）
           *
           * 往生者、功德芳名：最多姓名个数
           */
          pic_num: 0,
          /**
           * 时间组件（type: 2）
           * 1: 今天及以后
           * 2: 全部可选
           *
           * 选择组件（type: 3）
           * 0: 单选
           * 1: 多选
           */
          dataType: 2,
          // 描述
          describe: '',
          /**
           * 输入最大长度（文本输入）
           *
           * 阳上人、往生者、功德芳名：每个姓名最多填写字数
           */
          font_length: 0,
          /**
           * 提示文字
           *
           * 1. 如果是下拉列表，这里是数组，装载下拉选择项
           * 2. 保存时接口参数是 ['str1', 'str2', ...]
           * 3. 接口时数据是 [{id: 1, name: 'str1'}, {id: 2, name: 'str2'}, ...]
           */
          prompt_text: '普通邮寄',
          /**
           * 类型
           * 1: 自定义-单行文本框
           * 2: 自定义-日期选择
           * 3: 自定义-下拉列表
           * 4: 联系人
           * 5: 电话号码
           * 6: 地址
           * 7: 自定义-多行文本框
           * 8: 性别
           * 9: 出生日期
           * 10: 阳上人
           * 11: 往生者
           * 12: 功德芳名
           * 13: 自定义-提示框
           * 14: 自定义-图片上传
           * 15: 心愿
           */
          inputType: 17,
          // 手机号码是否需要验证
          isVerify: 0,
          // Id
          id: 512571,
          // 是否必填
          is_must: 1,
        },
      ],
      // 无用字段
      explain: '',
      // 是否自动处理订单
      isAutoFinish: 0,
      // 报名限制次数（0为无限制）
      enroll_num: 0,
      // 结束时间
      endTime: '2099-12-31 00:00:00',
      // Id
      id: 34977,
      // 购买后的有效时间（按天数算，如果是年、月，也要换算成天数）
      durationDay: 0,
      // 库存
      stock: -1,
    },
    {
      sort: 1,
      printer: [],
      name: '纳福锦囊',
      subdivide_type: 4,
      price: 0,
      pic: 'https://pic.zizaihome.com/6b7635e6-223f-11ea-bb19-00163e0c1e1c.jpg',
      conversionSubdivide: 0,
      postScript: [
        {
          name: '普通邮寄',
          pic_num: 0,
          dataType: 2,
          describe: '',
          font_length: 0,
          prompt_text: '普通邮寄',
          inputType: 17,
          isVerify: 0,
          id: 512572,
          is_must: 1,
        },
      ],
      explain: '',
      isAutoFinish: 0,
      enroll_num: 0,
      endTime: '2099-12-31 00:00:00',
      id: 34978,
      durationDay: 0,
      stock: -1,
    },
    {
      sort: 2,
      printer: [],
      name: '钱多多招财鸿牛',
      subdivide_type: 4,
      price: 0,
      pic: 'https://pic.zizaihome.com/bd3f8eae-2163-11ea-968b-00163e0c1e1c.jpg',
      conversionSubdivide: 0,
      postScript: [
        {
          name: '普通邮寄',
          pic_num: 0,
          dataType: 2,
          describe: '',
          font_length: 0,
          prompt_text: '普通邮寄',
          inputType: 17,
          isVerify: 0,
          id: 512573,
          is_must: 1,
        },
      ],
      explain: '',
      isAutoFinish: 0,
      enroll_num: 0,
      endTime: '2099-12-31 00:00:00',
      id: 34979,
      durationDay: 0,
      stock: -1,
    },
  ],
};

export default html =>
  html.replace('{{ceremonyMap | safe}}', JSON.stringify(createdData));
