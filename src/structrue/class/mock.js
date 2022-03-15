export const update = {
  msg: '成功',
  result: 0,
};

export const getActivityList = {
  msg: '成功',
  result: 0,
  data: {
    total: 12,
    list: [
      {
        templeId: 1,
        name: '测试',
        deviceList: '1,2',
        startTime: '09:00:00',
        id: 1,
        endTime: '10:00:00',
        type: 1,
        signCode: '',
        status: 0,
      },
    ],
  },
};

export const del = {
  msg: '成功',
  result: 0,
};

export const getDeviceList = {
  msg: '成功',
  result: 0,
  data: [
    {
      deviceSerial: '1',
      supportNetwork: 0,
      addTime: '2020-09-21 00:00',
      name: '潜艇设备',
      validateCode: '1',
      id: 1,
      type: 'DEVICE_TYPE_FACE_ANALYZE',
      status: 0,
    },
    {
      deviceSerial: '1',
      supportNetwork: 0,
      addTime: '2020-09-21 00:00',
      name: '3设备',
      validateCode: '1',
      id: 2,
      type: 'DEVICE_TYPE_FACE_ANALYZE',
      status: 0,
    },
  ],
};
