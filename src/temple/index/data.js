/**
 * Created by senntyou on 2017/2/27.
 */
define(['lunar-calendar', 'js-cookie', 'common/env_data'], function(
  LunarCalendar,
  cookie,
  envData
) {
  var data = {
    //获取Url的参数
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
    // 存放一些数据
    misc: {
      // 上传的图片id，用于区别同一组件下不同图片
      imageId: 1,
      // 默认组件名称
      defaultTitle: [
        '寺院简介',
        '高僧法师',
        '活动',
        '感恩功德',
        '佛历',
        '',
        '殿堂场景',
      ],
      // 组件计数，因为后台给出的每个组件都是存放在单独的表中的，所以不同组件之间可能有相同的id，所以颠覆以前的做法，从新做
      componentCount: {
        '1': 1,
        '2': 1,
        '3': 1,
        '4': 1,
        '5': 1,
        '6': 1,
        '7': 1,
      },
      // 介绍组件上传限制
      introductionUploadLimit: 5,
      // 快捷入口组件最大个数
      shortcutItemsLimit: 20,
      // 佛事或文章内容的数据，总页数，总数，每页数，后台只返回一次
      paginationStat: {
        1: {},
        2: {},
      },
      // 佛历组件的佛事内容的数据，总页数，总数，每页数，后台只返回一次
      // 与前者分开
      calendarBuddhist: {},
      // 佛历组件请求已添加的佛事数据，日期为0时，有分页，用此属性装
      calendarSelectedBuddhist: {},
    },
    // 今天的日期数据
    today: (function() {
      // 当前日期对象
      var currentDateObj = new Date();

      return {
        year: currentDateObj.getFullYear(), // 当前4位年份
        month: currentDateObj.getMonth() + 1, // 当前月份 1-12
        weekDay: currentDateObj.getDay(), // 当前星期 0-6 (日-六)
        day: currentDateObj.getDate(), // 当前几号
      };
    })(),
    // 星期
    weekdays: [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ],
    // 佛历新建标题id计数（后端没给相应的接口，故在此实现）
    calendarNewAddedTitleId: 1,
    // 佛历新建标题容器（后端没给相应的接口，故在此实现）
    // format: id -> title
    calendarNewAddedTitle: {},
    // 寺院微站的地址，用于点击推广按钮是显示链接
    websiteUrl:
      'https://wx.zizaihome.com/website/templateWebsiteInfo?templeId=' +
      localStorage['templeid'] +
      (envData.envParamMark ? '&' + envData.envParamMark : ''),
    // 七牛图片处理后缀
    imagesParams: {
      // type == 1
      1: '?imageMogr/v2/thumbnail/!800x500r/gravity/center/crop/!800x500', // 16:10
      // type == 2
      2: '?imageMogr/v2/thumbnail/!480x480r/gravity/center/crop/!480x480', // 1:1
      // type == 3
      3: [
        '?imageMogr/v2/thumbnail/!500x250r/gravity/center/crop/!500x250', // 横向排列
        '?imageMogr/v2/thumbnail/!750x466r/gravity/center/crop/!750x466', // 竖向排列
        '?imageMogr/v2/thumbnail/!360x360r/gravity/center/crop/!360x360', // 竖向双行
        '?imageMogr/v2/thumbnail/!240x240r/gravity/center/crop/!240x240', // 竖向小图
      ],
      // type == 7,
      7: [
        '?imageMogr/v2/thumbnail/!556x300r/gravity/center/crop/!556x300', // 行
        '?imageMogr/v2/thumbnail/!432x300r/gravity/center/crop/!432x300', // 九宫格
      ],
    },
    // 横向，竖向大图，竖向双行 的样式类
    swipeListBodyClasses: ['', 'vertical', 'two-columns', 'vertical-small'],
  };

  // 今天得阴历数据，由LunarCalendar组件返回
  data.todayLunar = LunarCalendar.solarToLunar(
    data.today.year,
    data.today.month,
    data.today.day
  );

  return data;
});
