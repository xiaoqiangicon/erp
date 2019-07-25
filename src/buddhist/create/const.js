define(function() {
  var Const = {
    defaultSub: {
      name: '普通佛事',
      price: '',
      stock: '',
      endTime: '', // 到期时间
      durationDay: 0, // 时效时长
      enroll_num: 0, // 参与次数限制
      pic: '',
      id: '',
      printer: [],
      explain: '',
      isSingleMoney: 1, // 添加用于监控是否为单金额的字段，仅影响ui：控制自动生成随喜金额按钮和自动完成订单按钮的显隐
      isAutoFinish: 0, // 多金额的自动完成订单，默认关
      subdivide_type: 1, // 新加规格分类
    },

    defaultPs: {
      inputType: 1,
      name: '',
      is_must: 1,
      prompt_text: '',
      describe: '',
      dataType: 2,
      selectInput: [],
      pic_num: 1,
      font_length: 200, // 心愿字数限制字段
      isVerify: 0, // 手机号码附言 短信是否需要验证字段
    },

    defaultSubTypeList: [
      { name: '普通佛事', type: 1 },
      { name: '往生牌位', type: 2 },
      { name: '祈福牌位', type: 3 },
      { name: '邮寄佛事', type: 4 },
      { name: '时效佛事', type: 5 },
    ],
    defaultPsTypeList: [
      {
        value: 4,
        text: '联系人',
      },
      {
        value: 12,
        text: '功德芳名',
      },
      {
        value: 15,
        text: '心愿',
      },
      {
        value: 8,
        text: '性别',
      },
      {
        value: 9,
        text: '出生日期',
      },
      {
        value: 5,
        text: '联系电话',
      },
      {
        value: 6,
        text: '地址',
      },
      {
        value: 10,
        text: '阳上人',
      },
      {
        value: 11,
        text: '往生者',
      },
      {
        value: 13,
        text: '自定义-提示框',
      },
      {
        value: 1,
        text: '自定义-单行文本框',
      },
      {
        value: 2,
        text: '自定义-日期选择',
      },
      {
        value: 3,
        text: '自定义-下拉列表',
      },
      {
        value: 7,
        text: '自定义-多行文本框',
      },
      {
        value: 14,
        text: '自定义-图片上传',
      },
    ],
    feedbackImgArr: [
      // {
      //   value: 0,
      //   text: '不显示',
      //   src: '',
      // },
      {
        value: 1,
        text: '通用法会',
        src:
          'https://pic.zizaihome.com/5cc635f6-90ad-11e9-b31f-00163e0c001e.png',
      },
      {
        value: 2,
        text: '通用捐赠',
        src:
          'https://pic.zizaihome.com/5d1ebe38-90ad-11e9-8c90-00163e0c001e.png',
      },
      {
        value: 3,
        text: '供养万僧',
        src:
          'https://pic.zizaihome.com/3066b49a-90b2-11e9-ac35-00163e0c001e.png',
      },
      {
        value: 4,
        text: '放生修福',
        src:
          'https://pic.zizaihome.com/305dfbd4-90b2-11e9-8569-00163e0c001e.png',
      },
      {
        value: 5,
        text: '助印经书',
        src:
          'https://pic.zizaihome.com/3069f40c-90b2-11e9-a570-00163e0c001e.png',
      },
      {
        value: 6,
        text: '生日法会',
        src:
          'https://pic.zizaihome.com/5cbacbc6-90ad-11e9-9890-00163e0c001e.png',
      },
      {
        value: 7,
        text: '斋天普佛',
        src:
          'https://pic.zizaihome.com/5ca50d7c-90ad-11e9-aed0-00163e0c001e.png',
      },
      {
        value: 8,
        text: '佛前供灯',
        src:
          'https://pic.zizaihome.com/5db06af4-90ad-11e9-858e-00163e0c001e.png',
      },
      {
        value: 9,
        text: '奉花礼佛',
        src:
          'https://pic.zizaihome.com/5d4f00c0-90ad-11e9-a299-00163e0c001e.png',
      },
      {
        value: 10,
        text: '功德宝树',
        src:
          'https://pic.zizaihome.com/5e6d3b52-90ad-11e9-bfa9-00163e0c001e.png',
      },
      {
        value: 11,
        text: '日行一善',
        src:
          'https://pic.zizaihome.com/305dfde6-90b2-11e9-9666-00163e0c001e.png',
      },
    ],
  };

  return Const;
});
