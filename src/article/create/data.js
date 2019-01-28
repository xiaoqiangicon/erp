/**
 * Created by senntyou on 2017/8/3.
 */

define(['common/env_data'], function(envData) {
  var data = {
    // 编辑器示例
    editor: void 0,
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
    // 分类
    categories: void 0,
    // 添加封面的上传图片组件示例
    uploadCoverInstance: void 0,
    // 图片参数
    imageParams: {
      cover: '?imageMogr/v2/thumbnail/!900x500r/gravity/center/crop/!900x500',
    },
    // 保存时的文字
    saveTypeOriginText: ['存为草稿', '正式发布'],
    // 随机金额
    randomMoney:
      '5,5,5,5.55,5.88,6,6,6.66,6.68,6.88,7.77,8,8.88,9.66,9.99,10,10,10,10,10.01,10.88,11.11,13.14,13.88,15.68,16,16.66,16.88,18,18.18,18.88,19.19,19.88,20,20,20,20.66,20.66,22,22.22,25.55,26.66,26.88,28,28.88,68,88',
    // 随机金额只能输入中文逗号，英文逗号和点号与数字
    randomInputInvalidRegExp: /[^,，.\d]/g,
    // 中文逗号正则
    chineseCommaRegExp: /，/g,
    // 文章管理地址
    indexUrl: '/zzhadmin/articleIndex/',
    createUrl: '/zzhadmin/createArticleIndex/',
    // 分享地址
    shareLink:
      'https://wx.zizaihome.com/article/articleIndex?templeId=' +
      window.localStorage['templeid'] +
      (!!envData.envParamMark ? '&' + envData.envParamMark : '') +
      '&articleId=',
    // 二维码尺寸
    qrcodeSizes: [
      300, // 小
      500, // 中
      1000, // 大
    ],
    // 保存类型，中间有大量的延迟操作
    saveType: void 0,
    // 其他网站图片地址的匹配
    otherSiteUrlMatches: void 0,
    // 保存技术
    otherSiteUrlSaveCount: 0,
  };
  data.formatedParams = {
    action: !data.params.action
      ? 'add'
      : data.params.action == 'update'
      ? 'update'
      : data.params.action == 'copy'
      ? 'copy'
      : 'other',
    articleId: data.params.id,
  };

  return data;
});
