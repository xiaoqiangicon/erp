import * as images from './images';
var sample = {
  components: [
    {
      type: 1,
      name: 'introduction',
      displayName: '寺院简介',
    },
    {
      type: 2,
      name: 'personSaying',
      displayName: '高僧法师',
    },
    {
      type: 3,
      name: 'swipeList',
      displayName: '图文列表',
    },
    {
      type: 4,
      name: 'donateChart',
      displayName: '功德榜',
    },
    {
      type: 5,
      name: 'calendar',
      displayName: '佛历',
    },
    {
      type: 6,
      name: 'shortcut',
      displayName: '快捷入口',
    },
    {
      type: 7,
      name: 'house',
      displayName: '殿堂场景',
    },
  ],
  componentDisplaySample: {
    introduction: {
      sortId: 0,
      isUpdate: 0,
      type: 1,
      showPagination: true,
      authenticated: true,
      place: '地址',
      visitedCount: '1234',
      introduction: '寺院简介',
      swipes: [
        {
          link: '',
          image: images.exampleBanner,
        },
        {
          link: '',
          image: images.exampleBanner,
        },
        {
          link: '',
          image: images.exampleBanner,
        },
      ],
    },
    personSaying: {
      sortId: 0,
      isUpdate: 0,
      type: 2,
    },
    swipeList: {
      sortId: 0,
      isUpdate: 0,
      type: 3,
      subType: 1,
      title: '标题',
      swipes: [
        {
          description: '活动名称',
          image: images.exampleBanner,
          link: '',
        },
        {
          description: '活动名称',
          image: images.exampleBanner,
          link: '',
        },
        {
          description: '活动名称',
          image: images.exampleBanner,
          link: '',
        },
        {
          description: '活动名称',
          image: images.exampleBanner,
          link: '',
        },
        {
          description: '活动名称',
          image: images.exampleBanner,
          link: '',
        },
        {
          description: '活动名称',
          image: images.exampleBanner,
          link: '',
        },
        {
          description: '活动名称',
          image: images.exampleBanner,
          link: '',
        },
        {
          description: '活动名称',
          image: images.exampleBanner,
          link: '',
        },
        {
          description: '活动名称',
          image: images.exampleBanner,
          link: '',
        },
        {
          description: '活动名称',
          image: images.exampleBanner,
          link: '',
        },
      ],
    },
    donateChart: {
      sortId: 0,
      isUpdate: 0,
      type: 4,
      monthItems: [
        {
          sequence: 1,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 5000,
        },
        {
          sequence: 2,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 5000,
        },
        {
          sequence: 3,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 5000,
        },
        {
          sequence: 4,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 5000,
        },
        {
          sequence: 5,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 5000,
        },
        {
          sequence: 6,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 5000,
        },
        {
          sequence: 7,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 5000,
        },
        {
          sequence: 8,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 5000,
        },
        {
          sequence: 9,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 5000,
        },
        {
          sequence: 10,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 5000,
        },
      ],
      totalItems: [
        {
          sequence: 1,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 1000,
        },
        {
          sequence: 2,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 1000,
        },
        {
          sequence: 3,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 1000,
        },
        {
          sequence: 4,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 1000,
        },
        {
          sequence: 5,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 1000,
        },
        {
          sequence: 6,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 1000,
        },
        {
          sequence: 7,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 1000,
        },
        {
          sequence: 8,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 1000,
        },
        {
          sequence: 9,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 1000,
        },
        {
          sequence: 10,
          avatar: images.exampleAvatar,
          nickname: '昵称',
          amount: 1000,
        },
      ],
    },
    calendar: {
      sortId: 0,
      isUpdate: 0,
      type: 4,
      dayItems: void 0,
    },
    shortcut: {
      sortId: 0,
      isUpdate: 0,
      type: 6,
      title: '',
      items: [
        {
          title: '快捷入口',
          image: images.exampleAvatar,
          link: '/',
        },
        {
          title: '快捷入口',
          image: images.exampleAvatar,
          link: '/',
        },
        {
          title: '快捷入口',
          image: images.exampleAvatar,
          link: '/',
        },
        {
          title: '快捷入口',
          image: images.exampleAvatar,
          link: '/',
        },
      ],
    },
    house: {
      sortId: 0,
      isUpdate: 0,
      type: 7,
      title: '殿堂场景',
    },
  },
};
export default sample;
