/**
 * Created by senntyou on 2017/5/20.
 */

define(function() {
  // 格式化请求的数据
  var savedDataRefactorMap = [
    // 寺院介绍
    {
      sortId: 'id',
      id: 'message.id',
      province: 'message.province',
      city: 'message.city',
      district: 'message.area',
      introduction: 'message.describe',
      images: 'message.pic',
      _images: [
        {
          url: 'img_url',
        },
      ],
    },
    // 高僧法师
    {
      sortId: 'id',
      id: 'message_id',
      components: 'message',
      _components: [
        {
          name: 'religion_name',
          description: 'religion_prorerb',
          avatar: 'img_url',
          honorName: 'religion_title',
        },
      ],
    },
    // 图文组件
    {
      sortId: 'id',
      id: 'message.id',
      title: 'message.title',
      displaySource: 'message.content_type',
      sourceCategory: 'message.show_type',
      buddhistCategory: 'message.buddnist_ceremony_type_id',
      itemsCount: 'message.list_num',
      subType: 'message.show_list_type',
      showTitle: 'message.is_show_title',
      showMore: 'message.is_show_more',
      articleCategory: 'message.article_type_id',
      images: 'message.templeWebsiteImageTextlist',
      _images: [
        {
          id: 'buddnist_ceremony_commodity_id',
          articleId: 'article_id',
          content: 'title',
          url: 'pic',
          status: 'progressType',
        },
      ],
    },
    // 功德榜组件
    {
      sortId: 'id',
      id: 'message.id',
      title: 'message.title',
      itemsCount: 'message.show_list_num',
      showRealTimeList: 'message.is_show_real_time_list',
      showMonthList: 'message.is_show_month_list',
      showTotalList: 'message.is_show_total_list',
    },
    // 佛历
    {
      sortId: 'id',
      id: 'message_id',
      totalPages: 'total',
    },
    // 快捷入口组件
    {
      sortId: 'id',
      id: 'message.id',
      title: 'message.title',
      items: 'message.linkList',
      _items: [
        {
          image: 'pic',
          title: 'name',
          subTypeId: 'message_id',
          linkType: 'link_type',
        },
      ],
    },
    // 殿堂场景
    {
      sortId: 'id',
      id: 'message_id',
      houses: 'message.list',
      _houses: [
        {
          covers: 'pic',
          intro: 'detail',
        },
      ],
    },
  ];

  return savedDataRefactorMap;
});
