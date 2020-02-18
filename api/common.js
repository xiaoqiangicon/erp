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

// 更新单条推送信息为已读
export const updateTempleMessageRead = {
  msg: '成功',
  result: 0,
};

// 获取寺院推送信息列表
export const getTempleMessageList = {
  msg: '成功',
  result: 0,
  total: 20,
  data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => ({
    title: '标题标题标题标题' + id,
    url: '/url',
    addTime: '2020-02-04 Feb:32:20',
    content:
      '测试一下测试一下测试一下测试一下测试一下测试一下测试一下测试一下测试一下',
    isRead: 0,
    id: id,
  })),
};
