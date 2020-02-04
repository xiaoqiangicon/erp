// 获取广告信息
export const getErpAd = {
  msg: '成功',
  result: 0,
  announcement: {
    link: 'https://wxapp1.zizaihome.com/article/articleIndex?articleId=100',
    name: '测试',
    picUrl:
      'https://pic.zizaihome.com/9188bd76-60c6-4747-8d28-aa2d43077112.png',
  },
  erpAdDataList: [
    {
      position: 1,
      picUrl:
        'https://pic.zizaihome.com/33bf6aee-cf13-43ef-97a4-33dfb9b4fe7c.jpg',
      link: 'http://www.test.com',
      id: 11,
      name: '测试',
    },
    {
      position: 2,
      picUrl:
        'https://pic.zizaihome.com/fe958f33-1b56-4c0a-870c-20400d695b14.jpg',
      link: 'http://www.test.com',
      id: 12,
      name: '测试',
    },
  ],
  appletsAdDataList: [
    {
      position: 1,
      link: 'https://wxapp1.zizaihome.com/article/articleIndex?articleId=100',
      name: '测试',
      picUrl: 'http://test.jpg',
    },
    {
      position: 1,
      link: 'https://wxapp1.zizaihome.com/article/articleIndex?articleId=100',
      name: '测试',
      picUrl: 'http://test.jpg',
    },
  ],
};

// 点击推荐位广告上报
export const clickAd = {
  msg: '成功',
  result: 0,
};
