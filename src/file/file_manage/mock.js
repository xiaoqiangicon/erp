export const getFileList = {
  msg: '成功',
  result: 0,
  data: {
    list: [
      {
        id: 347,
        fileName: '文件名',
        type: 1,
        addTime: '2020-09-09 12:11',
        managerName: '文件主人名',
        fileSize: '305KB',
      },
    ],
    total: 101,
  },
};

export const getUserList = {
  msg: '',
  result: 0,
  data: [
    {
      id: 1,
      name: '王大妈',
    },
    {
      id: 2,
      name: '李大妈',
    },
  ],
};

export const download = {
  msg: '成功',
  result: 0,
  data: '/sample/image1.jpg',
};

export const del = {
  msg: '成功',
  result: 0,
};

export const update = {
  msg: '成功',
  result: 0,
};

export const getShareList = {
  msg: '成功',
  result: 0,
  data: {
    shareList: [
      {
        userId: 123,
        managerId: 111,
        name: '共享人名字',
        headImg: '/sample/image1.jpg',
        typeStr: '方丈',
        fileId: 222,
      },
      {
        userId: 123,
        managerId: 111,
        name: '共享人名字',
        headImg: '/sample/image1.jpg',
        typeStr: '方丈',
        fileId: 222,
      },
    ],
    managerList: [
      {
        userId: 123,
        managerId: 111,
        name: '共享人名字',
        headImg: '/sample/image1.jpg',
        typeStr: '方丈',
        fileId: 222,
      },
      {
        userId: 123,
        managerId: 111,
        name: '共享人名字',
        headImg: '/sample/image1.jpg',
        typeStr: '方丈',
        fileId: 222,
      },
    ],
  },
};
