export const getDeviceList = {
  msg: '成功',
  result: 0,
  data: [
    {
      typeStr: '客流摄像头',
      deviceSerial: 'E60029258',
      supportNetwork: 0,
      addTime: '2020-09-21 00:00',
      name: '客流摄像头',
      validateCode: 'LOSMHA',
      id: 2,
      type: 'guest_ipc',
      status: 0,
    },
    {
      typeStr: '网关',
      deviceSerial: 'Q02978134',
      supportNetwork: 0,
      addTime: '2020-09-21 00:00',
      name: 'A2网关',
      validateCode: 'UXLFSA',
      id: 3,
      type: 'gate_way',
      status: 0,
    },
    {
      typeStr: '烟雾报警器',
      deviceSerial: '864696020',
      supportNetwork: 0,
      addTime: '2020-09-21 00:00',
      name: '烟雾报警器',
      validateCode: 'Q02978134',
      id: 4,
      type: 'fire_alarm',
      status: 0,
    },
  ],
};

export const getCameraUrl = {
  msg: '成功',
  result: 0,
  data: 'https://pic.zizaihome.com/b7c155f70d6a2d0a49cabcb6b790ce6b.mp4',
};

export const deviceLogList = {
  msg: '成功',
  result: 0,
  data: {
    lastId: 11,
    list: [
      {
        id: 3,
        time: '2020年12月11日 12:11',
        name: '摄像头',
        content: '谢谢啊世纪大酒店那就等你',
      },
      {
        id: 4,
        time: '2020年12月11日 12:11',
        name: '摄像头2',
        content: '谢谢啊世纪大酒店那就等你',
      },
      {
        id: 5,
        time: '2020年12月11日 12:11',
        name: '摄像头3',
        content: '谢谢啊世纪大酒店那就等你',
      },
      {
        id: 6,
        time: '2020年12月11日 12:11',
        name: '摄像头4',
        content: '谢谢啊世纪大酒店那就等你',
      },
    ],
  },
};

export const cancelAlarm = {
  msg: '成功',
  result: 0,
};
