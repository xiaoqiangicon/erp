import LunarCalendar from 'lunar-calendar';
import cookie from 'js-cookie';
import envData from 'common/env_data';
var data = {
  params: (function() {
    var params = {};
    !!location.search &&
      location.search
        .slice(1)
        .split('&')
        .map(function(item) {
          params[item.split('=')[0]] = item.split('=')[1];
        });
    return params;
  })(),
  misc: {
    imageId: 1,
    defaultTitle: [
      '寺院简介',
      '高僧法师',
      '活动',
      '感恩功德',
      '佛历',
      '',
      '殿堂场景',
    ],
    componentCount: {
      '1': 1,
      '2': 1,
      '3': 1,
      '4': 1,
      '5': 1,
      '6': 1,
      '7': 1,
    },
    introductionUploadLimit: 5,
    shortcutItemsLimit: 20,
    paginationStat: {
      1: {},
      2: {},
    },
    calendarBuddhist: {},
    calendarSelectedBuddhist: {},
  },
  today: (function() {
    var currentDateObj = new Date();
    return {
      year: currentDateObj.getFullYear(),
      month: currentDateObj.getMonth() + 1,
      weekDay: currentDateObj.getDay(),
      day: currentDateObj.getDate(),
    };
  })(),
  weekdays: [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ],
  calendarNewAddedTitleId: 1,
  calendarNewAddedTitle: {},
  websiteUrl:
    'https://wx.zizaihome.com/website/templateWebsiteInfo?templeId=' +
    localStorage['templeId'] +
    (envData.envParamMark ? '&' + envData.envParamMark : ''),
  imagesParams: {
    1: '?imageMogr/v2/thumbnail/!800x500r/gravity/center/crop/!800x500',
    2: '?imageMogr/v2/thumbnail/!480x480r/gravity/center/crop/!480x480',
    3: [
      '?imageMogr/v2/thumbnail/!500x250r/gravity/center/crop/!500x250',
      '?imageMogr/v2/thumbnail/!750x466r/gravity/center/crop/!750x466',
      '?imageMogr/v2/thumbnail/!360x360r/gravity/center/crop/!360x360',
      '?imageMogr/v2/thumbnail/!240x240r/gravity/center/crop/!240x240',
    ],
    7: [
      '?imageMogr/v2/thumbnail/!556x300r/gravity/center/crop/!556x300',
      '?imageMogr/v2/thumbnail/!432x300r/gravity/center/crop/!432x300',
    ],
  },
  swipeListBodyClasses: ['', 'vertical', 'two-columns', 'vertical-small'],
};
data.todayLunar = LunarCalendar.solarToLunar(
  data.today.year,
  data.today.month,
  data.today.day
);
export default data;
