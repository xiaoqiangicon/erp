/**
 * Created by senntyou on 2017/5/20.
 */

define(function() {
  // 保存数据时反重构
  var saveReverse = [
    // 寺院介绍
    {
      pics: 'images',
      describe: 'introduction',
      area: 'district',
    },
    // 高僧法师
    {
      list: 'components',
      _list: [
        {
          religion_name: 'name',
          religion_prorerb: 'description',
          img_url: 'avatar',
          religion_title: 'honorName',
        },
      ],
    },
    // 图文组件
    {
      content_type: 'displaySource',
      show_type: 'sourceCategory',
      show_list_type: 'subType',
      buddnist_ceremony_type_id: 'buddhistCategory',
      list_num: 'itemsCount',
      is_show_title: 'showTitle',
      is_show_more: 'showMore',
      article_type_id: 'articleCategory',
      imageTestList: 'images',
      _imageTestList: [
        {
          commodityId: 'id',
          //articleId: 'articleId',
          title: 'content',
          pic: 'url',
        },
      ],
    },
    // 功德榜组件
    {
      show_list_num: 'itemsCount',
      is_show_real_time_list: 'showRealTimeList',
      is_show_month_list: 'showMonthList',
      is_show_total_list: 'showTotalList',
    },
    // 佛历
    {},
    // 快捷入口组件
    {
      linkList: 'items',
      _linkList: [
        {
          pic: 'image',
          name: 'title',
          messageId: 'subTypeId',
        },
      ],
    },
    // 殿堂场景
    {
      list: 'houses',
      _list: [
        {
          pic: 'covers',
          detail: 'intro',
        },
      ],
    },
  ];

  return saveReverse;
});
