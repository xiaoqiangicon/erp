import { urlParams } from '../../../../pro-com/src/utils';

// 共享数据
export const shareData = {
  createdData: {},
};

export const urlData = {
  edit: parseInt(urlParams.edit, 10),
  id: parseInt(urlParams.id, 10),
  templateId: parseInt(urlParams.templateId, 10),
  ifTemplate: parseInt(urlParams.ifTemplate, 10),
  verifyId: parseInt(urlParams.verifyId, 10),
  // 创建佛事
  createByPlain: false,
  // 复制佛事
  createByCopy: false,
  // 系统模板创建
  createBySysTpl: false,
  // 自定义模板创建
  createByCusTpl: false,
  // 更新佛事
  updateFoShi: false,
  // 编辑模板
  updateCusTpl: false,
};

if (urlData.edit === 0) {
  urlData.createByCopy = true;
} else if (urlData.edit === 1) {
  urlData.updateFoShi = true;
} else if (urlData.edit === 2) {
  urlData.createBySysTpl = true;
} else if (urlData.edit === 3) {
  urlData.createByCusTpl = !urlData.ifTemplate;
  urlData.updateCusTpl = !!urlData.ifTemplate;
} else {
  urlData.createByPlain = true;
}

/**
 * 用于选择的附言列表
 *
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
 * @type {*[]}
 */
export const selectFuYanList = [
  { value: 16, name: '用户自选邮寄' },
  { value: 17, name: '普通邮寄' },
  { value: 4, name: '联系人' },
  { value: 12, name: '功德芳名' },
  { value: 15, name: '心愿' },
  { value: 8, name: '性别' },
  { value: 9, name: '出生日期' },
  { value: 5, name: '手机号码' },
  { value: 6, name: '地址' },
  { value: 10, name: '阳上人' },
  { value: 11, name: '往生者' },
  { value: 18, name: '地区' },
  { value: 19, name: '详细地址' },
  { value: 13, name: '自定义-提示框' },
  { value: 1, name: '自定义-单行文本框' },
  { value: 2, name: '自定义-日期选择' },
  { value: 3, name: '自定义-下拉列表' },
  { value: 7, name: '自定义-多行文本框' },
  { value: 14, name: '自定义-图片上传' },
];

export const selectFuYanWS = [
  { value: 16, name: '用户自选邮寄' },
  { value: 17, name: '普通邮寄' },
  { value: 4, name: '联系人' },
  { value: 12, name: '功德芳名' },
  { value: 15, name: '心愿' },
  { value: 8, name: '性别' },
  { value: 5, name: '手机号码' },
  { value: 13, name: '自定义-提示框' },
  { value: 1, name: '自定义-单行文本框' },
  { value: 2, name: '自定义-日期选择' },
  { value: 3, name: '自定义-下拉列表' },
  { value: 7, name: '自定义-多行文本框' },
  { value: 14, name: '自定义-图片上传' },
];

export const selectFuYanQF = [
  { value: 16, name: '用户自选邮寄' },
  { value: 17, name: '普通邮寄' },
  { value: 4, name: '联系人' },
  { value: 8, name: '性别' },
  { value: 5, name: '手机号码' },
  { value: 10, name: '阳上人' },
  { value: 11, name: '往生者' },
  { value: 13, name: '自定义-提示框' },
  { value: 1, name: '自定义-单行文本框' },
  { value: 2, name: '自定义-日期选择' },
  { value: 3, name: '自定义-下拉列表' },
  { value: 7, name: '自定义-多行文本框' },
  { value: 14, name: '自定义-图片上传' },
];

/**
 * 邮寄佛事专用的附言列表
 *
 * 16: 用户自选邮寄
 * 17: 普通邮寄
 * @type {Array}
 */
export const expressFuYanList = [
  // { value: 16, name: '用户自选邮寄' },
  // { value: 17, name: '普通邮寄' },
  ...selectFuYanList,
];

// 新创建的附言列表（用于生成新的）
export const plainFuYanList = [
  {
    inputType: 1,
    prompt_text: '',
    describe: '',
    name: '',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 2,
    prompt_text: '',
    describe: '',
    name: '',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 3,
    prompt_text: '',
    describe: '',
    name: '',
    is_must: 1,
    dataType: 0,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 4,
    prompt_text: '请填写联系人姓名（方便寺院与您联系）',
    describe: '',
    name: '联系人',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 5,
    prompt_text: '请填写联系人电话（方便寺院与您联系）',
    describe: '',
    name: '手机号码',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 6,
    prompt_text: '请填写您常用的居住地址',
    describe: '',
    name: '地址',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 7,
    prompt_text: '',
    describe: '',
    name: '',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 8,
    prompt_text: '',
    describe: '',
    name: '性别',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 9,
    prompt_text: '',
    describe: '',
    name: '出生日期',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 10,
    prompt_text: '请填写功德主姓名（在世）',
    describe: '',
    name: '阳上人',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 5,
  },
  {
    inputType: 11,
    prompt_text: '请填写已故者姓名（已去世）',
    describe: '',
    name: '往生者',
    is_must: 1,
    dataType: 2,
    pic_num: 6,
    isVerify: 0,
    font_length: 5,
  },
  {
    inputType: 12,
    prompt_text: '请填写功德主姓名',
    describe: '',
    name: '功德芳名',
    is_must: 1,
    dataType: 2,
    pic_num: 6,
    isVerify: 0,
    font_length: 5,
  },
  {
    inputType: 13,
    prompt_text: '',
    describe: '',
    name: '',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 14,
    prompt_text: '',
    describe: '',
    name: '',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 15,
    prompt_text: '请填写您的心愿',
    describe: '',
    name: '心愿',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 50,
  },
  {
    inputType: 16,
    prompt_text: '是否邮寄',
    describe: '',
    name: '是否邮寄',
    is_must: 1,
    dataType: 2,
    pic_num: 0,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 17,
    prompt_text: '普通邮寄',
    describe: '',
    name: '普通邮寄',
    is_must: 1,
    dataType: 2,
    pic_num: 0,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 18,
    prompt_text: '请选择您常用的地区',
    describe: '',
    name: '地区',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 19,
    prompt_text: '请填写您的详细地址',
    describe: '',
    name: '详细地址',
    is_must: 0,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
];

/**
 * 用于选择的规格列表
 *
 * 类型
 * 1: 普通佛事
 * 2: 往生牌位
 * 3: 祈福牌位
 * 4: 邮寄佛事
 * @type {*[]}
 */
export const selectGuiGeList = [
  { value: 1, name: '普通佛事' },
  { value: 2, name: '往生牌位' },
  { value: 3, name: '祈福牌位' },
  { value: 4, name: '邮寄佛事' },
];

// 新创建的规格列表（用于生成新的）
export const plainGuiGeList = [
  {
    postScript: [],
    name: '普通佛事',
    printer: [],
    pic: '',
    explain: '',
    isAutoFinish: 0,
    subdivide_type: 1,
    endTime: '',
    durationDay: '',
    enroll_num: 0,
    sort: 0,
    price: '',
    stock: '',
  },
  {
    postScript: [
      {
        inputType: 10,
        prompt_text: '请填写功德主姓名（在世）',
        name: '阳上人',
        is_must: 1,
        dataType: 2,
        pic_num: 1,
        describe: '',
        isVerify: 0,
        font_length: 5,
      },
      {
        inputType: 11,
        prompt_text: '请填写已故者姓名（已去世）',
        name: '往生者',
        is_must: 1,
        dataType: 2,
        pic_num: 6,
        describe: '',
        isVerify: 0,
        font_length: 5,
      },
      {
        inputType: 9,
        prompt_text: '',
        describe: '',
        name: '逝者的出生日期',
        is_must: 0,
        dataType: 2,
        pic_num: 0,
        isVerify: 0,
        font_length: 0,
      },
      {
        inputType: 9,
        prompt_text: '',
        describe: '',
        name: '逝者的往生日期',
        is_must: 0,
        dataType: 2,
        pic_num: 0,
        isVerify: 0,
        font_length: 0,
      },
      {
        inputType: 6,
        prompt_text: '请选择您常用的地区',
        name: '地区',
        is_must: 0,
        dataType: 2,
        pic_num: 4,
        describe: '',
        isVerify: 0,
        font_length: 20,
      },
      {
        inputType: 19,
        prompt_text: '请填写您的详细地址',
        describe: '',
        name: '详细地址',
        is_must: 0,
        dataType: 2,
        pic_num: 1,
        isVerify: 0,
        font_length: 0,
      },
    ],
    name: '往生牌位',
    printer: [],
    pic: 'https://pic.zizaihome.com/7b7c6276-0d6f-11e8-8feb-00163e0c001e.png',
    explain: '',
    isAutoFinish: 0,
    subdivide_type: 2,
    endTime: '',
    durationDay: '',
    enroll_num: 0,
    sort: 0,
    price: '',
    stock: '',
  },
  {
    postScript: [
      {
        inputType: 12,
        prompt_text: '请填写功德主姓名',
        name: '功德芳名',
        is_must: 1,
        dataType: 2,
        pic_num: 6,
        describe: '',
        isVerify: 0,
        font_length: 5,
      },
      {
        inputType: 9,
        prompt_text: '',
        describe: '',
        name: '功德主的出生日期',
        is_must: 0,
        dataType: 2,
        pic_num: 1,
        isVerify: 0,
        font_length: 0,
      },
      {
        inputType: 6,
        prompt_text: '请选择您常用的地区',
        name: '地区',
        is_must: 0,
        dataType: 2,
        pic_num: 4,
        describe: '',
        isVerify: 0,
        font_length: 20,
      },
      {
        inputType: 19,
        prompt_text: '请填写您的详细地址',
        describe: '',
        name: '详细地址',
        is_must: 0,
        dataType: 2,
        pic_num: 1,
        isVerify: 0,
        font_length: 0,
      },
      {
        inputType: 15,
        prompt_text: '请填写您的心愿',
        name: '心愿',
        is_must: 0,
        dataType: 2,
        pic_num: 0,
        describe: '',
        isVerify: 0,
        font_length: 50,
      },
    ],
    name: '祈福牌位',
    printer: [],
    pic: 'https://pic.zizaihome.com/7d424d78-0d6f-11e8-8feb-00163e0c001e.png',
    explain: '',
    isAutoFinish: 0,
    subdivide_type: 3,
    endTime: '',
    durationDay: '',
    enroll_num: 0,
    sort: 0,
    price: '',
    stock: '',
  },
  {
    postScript: [
      {
        dataType: 2,
        describe: '',
        font_length: 0,
        inputType: 17,
        isVerify: 0,
        is_must: 1,
        name: '普通邮寄',
        pic_num: 0,
        prompt_text: '普通邮寄',
      },
    ],
    name: '邮寄佛事',
    printer: [],
    pic: '',
    explain: '',
    isAutoFinish: 0,
    subdivide_type: 4,
    endTime: '',
    durationDay: '',
    enroll_num: 0,
    sort: 0,
    price: '',
    stock: '',
  },
];

// 自动生成随机金额
export const randomPrices =
  '5,5,5,5.55,5.88,6,6,6.66,6.68,6.88,7.77,8,8.88,9.66,9.99,10,10,10,10,10.01,10.88,11.11,13.14,13.88,15.68,16,16.66,16.88,18,18.18,18.88,19.19,19.88,20,20,20,20.66,22,22.22,25.55,26.66,26.88,28,28.88,33.33,36,38.88,46.66,49.99,50,66.66,68.68,88.88,99.99,100,108,168';
// 红包封面
export const redPacketCover =
  'https://pic.zizaihome.com/e0898a9c-23a1-11e9-9b75-00163e0c001e.jpg';

// 可视化附言预览图
export const fuYanPreviewImages = {
  // 往生排位
  2: [
    {
      src: 'https://pic.zizaihome.com/fd4dd4da-0bfb-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7b7c6276-0d6f-11e8-8feb-00163e0c001e.png',
    },
    {
      src: 'https://pic.zizaihome.com/0b34c996-0bfc-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7b7c6276-0d6f-11e8-8feb-00163e0c001e.png',
    },
    {
      src: 'https://pic.zizaihome.com/0b34c996-0bfc-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7b7c6276-0d6f-11e8-8feb-00163e0c001e.png',
    },
    {
      src: 'https://pic.zizaihome.com/0b34c996-0bfc-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7b7c6276-0d6f-11e8-8feb-00163e0c001e.png',
    },
    {
      src: 'https://pic.zizaihome.com/0b34c996-0bfc-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7b7c6276-0d6f-11e8-8feb-00163e0c001e.png',
    },
    {
      src: 'https://pic.zizaihome.com/0b34c996-0bfc-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7b7c6276-0d6f-11e8-8feb-00163e0c001e.png',
    },
  ],
  // 祈福排位
  3: [
    {
      src: 'https://pic.zizaihome.com/478059f6-0bfc-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7d424d78-0d6f-11e8-8feb-00163e0c001e.png',
    },
    {
      src: 'https://pic.zizaihome.com/574a0f44-0bfc-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7d424d78-0d6f-11e8-8feb-00163e0c001e.png',
    },
    {
      src: 'https://pic.zizaihome.com/574a0f44-0bfc-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7d424d78-0d6f-11e8-8feb-00163e0c001e.png',
    },
    {
      src: 'https://pic.zizaihome.com/574a0f44-0bfc-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7d424d78-0d6f-11e8-8feb-00163e0c001e.png',
    },
    {
      src: 'https://pic.zizaihome.com/574a0f44-0bfc-11e8-91da-00163e0c001e.png',
      thumbnail:
        'https://pic.zizaihome.com/7d424d78-0d6f-11e8-8feb-00163e0c001e.png',
    },
  ],
};

// 功德证书
export const feedbackPrizes = [
  {
    value: 1,
    name: '通用法会',
    cover: 'https://pic.zizaihome.com/5cc635f6-90ad-11e9-b31f-00163e0c001e.png',
  },
  {
    value: 2,
    name: '通用捐赠',
    cover: 'https://pic.zizaihome.com/5d1ebe38-90ad-11e9-8c90-00163e0c001e.png',
  },
  {
    value: 3,
    name: '供养万僧',
    cover: 'https://pic.zizaihome.com/3066b49a-90b2-11e9-ac35-00163e0c001e.png',
  },
  {
    value: 4,
    name: '放生修福',
    cover: 'https://pic.zizaihome.com/305dfbd4-90b2-11e9-8569-00163e0c001e.png',
  },
  {
    value: 5,
    name: '助印经书',
    cover: 'https://pic.zizaihome.com/3069f40c-90b2-11e9-a570-00163e0c001e.png',
  },
  {
    value: 6,
    name: '生日法会',
    cover: 'https://pic.zizaihome.com/5cbacbc6-90ad-11e9-9890-00163e0c001e.png',
  },
  {
    value: 7,
    name: '斋天普佛',
    cover: 'https://pic.zizaihome.com/5ca50d7c-90ad-11e9-aed0-00163e0c001e.png',
  },
  {
    value: 8,
    name: '佛前供灯',
    cover: 'https://pic.zizaihome.com/eca05748-6d40-4900-b3f0-3b256cfe5190.png',
  },
  {
    value: 9,
    name: '奉花礼佛',
    cover: 'https://pic.zizaihome.com/5d4f00c0-90ad-11e9-a299-00163e0c001e.png',
  },
  {
    value: 10,
    name: '功德宝树',
    cover: 'https://pic.zizaihome.com/5e6d3b52-90ad-11e9-bfa9-00163e0c001e.png',
  },
  {
    value: 11,
    name: '日行一善',
    cover: 'https://pic.zizaihome.com/305dfde6-90b2-11e9-9666-00163e0c001e.png',
  },
  {
    value: 12,
    name: '供奉拜垫',
    cover: 'https://pic.zizaihome.com/56e1c0a6-748d-48d4-8c90-bd1dce3e1bbc.png',
  },
];

// 默认的支付成功反馈信息富文本
export const defaultPaySuccessHtml =
  '<section><section style="margin: 10px auto;"><section style="border-style: solid;-webkit-border-image: url(http://mpt.135editor.com/mmbiz_png/yqVAqoZvDibGpfYS2cC4YzbozH31oekibOFPBxA1CDIwaGogibNAnYBrrLIvt9q2U2RhpJruHxyI9YyMStIK84ibgw/0?wx_fmt=png) 65 fill;border-width: 20px;padding: 5px;color:#feda8c;"><p style="text-align: center;"><span style="font-size: 24px; caret-color: red;"><br/></span></p><p style="text-align: center;"><span style="font-size: 24px; caret-color: red;">随喜赞叹，功德无量。</span></p><p style="text-align: center;"><span style="font-size: 24px; caret-color: red;">福慧双增，所愿皆遂。</span></p><p><span style="font-size: 24px; caret-color: red;"><br/></span></p></section></section></section>';

// 小票打印机默认设置
export const defaultPrinterSetting = {
  // 打印机type
  printerType: 0,
  // 打印联数 1-5
  continuousPrintNum: 1,
  // 是否打印电话号码
  isPrintMobile: 1,
  // 是否打印二维码（1 全部打印，2 隔联打印，3 不打印）
  qrcodePrint: 1,
  // 印章类型
  sealType: 2,
  sealTypeBottom: 3,
  fontType: 0,
};
