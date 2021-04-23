export const getTemple = {
  temple: {
    recruitPromotionTitle: '推广员招募计划',
    badreview: 3,
    update_time: '2019-12-18 12:03:51',
    show_website_scenes_suixi: 1,
    name: '小麦寺院',
    show_website_suixi: 1,
    isRecruitPromotion: 1,
    stamp: 'https://pic.zizaihome.com/1494389343398.jpg',
    praisenum: 1,
    addition: '',
    recruitPromotionContent:
      '<section><img src=https://pic.zizaihome.com/eaeff89c-01df-11e9-9b9a-00163e0c001e.12.17.png style=max-width: 100%;/></section>',
    isTest: 1,
    show_website_abbot_suixi: 1,
    mobile: '15014139212',
    express_receipt_num: 3,
    satisfactionnum: 4,
    buddhaWallPic:
      'https://pic.zizaihome.com/1494389929828.gif,https://pic.zizaihome.com/1494389888053.jpg,https://pic.zizaihome.com/1494389882213.jpg,https://pic.zizaihome.com/1494389872464.jpg,https://pic.zizaihome.com/1494389868545.jpg',
    applicationId: 0,
    id: 4,
    isPromotionReview: 1,
    add_time: '2016-10-06 19:10:28',
  },
};

export const orderNumGet = {
  buddhaWallCount: 222,
  commodityCount: 333,
};

// 获取积分任务列表
export const getTempleMissionList = {
  templeLevel: 2,
  msg: '成功',
  total: 12,
  data: [1, 2, 3, 4, 5].map(id => ({
    content:
      '活动内容活动内容活动内容活动内容活动内容活动内容活动内容活动内容活动内容活动内容活动内容活动内容',
    addTime: '2020-02-19 14:45:15',
    integral: 188,
    title:
      '测试活动测试活动测试活动测试活动测试活动测试活动测试活动测试活动' + id,
  })),
  result: 0,
};

export const createCeremonyTypeList = {
  msg: '',
  data: '.'
    .repeat(10)
    .split('')
    .map((d, i) => ({
      ceremonyTypeId: i + 1,
      name: `分类名称${Math.floor(Math.random() * 100)}`,
    })),
  result: 0,
};

export const createCeremonyType = {
  msg: '添加成功',
  result: 0,
  typeId: 2346,
};

export const managerEditCeremonyType = {
  msg: '修改成功',
  result: 0,
};

export const delCeremonyType = {
  msg: '删除成功',
  result: 0,
};

export const uploadPic = {
  msg: '上传成功',
  result: 0,
  url: 'https://pic.zizaihome.com/97a8607c-a406-11eb-9ea2-00163e0c1e1c.mp4',
};
