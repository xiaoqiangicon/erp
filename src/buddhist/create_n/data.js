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
  { value: 4, name: '联系人' },
  { value: 12, name: '功德芳名' },
  { value: 15, name: '心愿' },
  { value: 8, name: '性别' },
  { value: 9, name: '出生日期' },
  { value: 5, name: '手机号码' },
  { value: 6, name: '地址' },
  { value: 10, name: '阳上人' },
  { value: 11, name: '往生者' },
  { value: 13, name: '自定义-提示框' },
  { value: 1, name: '自定义-单行文本框' },
  { value: 2, name: '自定义-日期选择' },
  { value: 3, name: '自定义-下拉列表' },
  { value: 7, name: '自定义-多行文本框' },
  { value: 14, name: '自定义-图片上传' },
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
    font_length: 0,
  },
  {
    inputType: 11,
    prompt_text: '请填写已故者姓名（已去世）',
    describe: '',
    name: '往生者',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 0,
  },
  {
    inputType: 12,
    prompt_text: '请填写功德主姓名',
    describe: '',
    name: '功德芳名',
    is_must: 1,
    dataType: 2,
    pic_num: 1,
    isVerify: 0,
    font_length: 10,
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
    sort: 4,
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
        pic_num: 0,
        describe: '',
        isVerify: 0,
        font_length: 4,
      },
      {
        inputType: 11,
        prompt_text: '请填写已故者姓名（已去世）',
        name: '往生者',
        is_must: 1,
        dataType: 2,
        pic_num: 4,
        describe: '',
        isVerify: 0,
        font_length: 4,
      },
      {
        inputType: 6,
        prompt_text: '请选择所在地区',
        name: '所在地区',
        is_must: 1,
        dataType: 2,
        pic_num: 0,
        describe: '',
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
    sort: 5,
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
        pic_num: 4,
        describe: '',
        isVerify: 0,
        font_length: 4,
      },
      {
        inputType: 15,
        prompt_text: '请填写您的心愿',
        name: '心愿',
        is_must: 1,
        dataType: 2,
        pic_num: 0,
        describe: '',
        isVerify: 0,
        font_length: 40,
      },
      {
        inputType: 6,
        prompt_text: '请选择所在地区',
        name: '所在地区',
        is_must: 1,
        dataType: 2,
        pic_num: 0,
        describe: '',
        isVerify: 0,
        font_length: 0,
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
    sort: 6,
    price: '',
    stock: '',
  },
  {
    postScript: [
      {
        dataType: 2,
        describe: '',
        font_length: 0,
        inputType: '17',
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
    sort: 7,
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
