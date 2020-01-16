import envData from 'common/env_data';
var data = {
  editor: void 0,
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
  categories: void 0,
  uploadCoverInstance: void 0,
  imageParams: {
    cover: '?imageMogr/v2/thumbnail/!900x500r/gravity/center/crop/!900x500',
  },
  saveTypeOriginText: ['存为草稿', '正式发布'],
  randomMoney:
    '5,5,5,5.55,5.88,6,6,6.66,6.68,6.88,7.77,8,8.88,9.66,9.99,10,10,10,10,10.01,10.88,11.11,13.14,13.88,15.68,16,16.66,16.88,18,18.18,18.88,19.19,19.88,20,20,20,20.66,20.66,22,22.22,25.55,26.66,26.88,28,28.88,68,88',
  randomInputInvalidRegExp: /[^,，.\d]/g,
  chineseCommaRegExp: /，/g,
  indexUrl: '/zzhadmin/articleIndex/',
  createUrl: '/zzhadmin/createArticleIndex/',
  shareLink:
    'https://wx.zizaihome.com/article/articleIndex?templeId=' +
    window.localStorage['templeId'] +
    (!!envData.envParamMark ? '&' + envData.envParamMark : '') +
    '&articleId=',
  qrcodeSizes: [300, 500, 1000],
  saveType: void 0,
  otherSiteUrlMatches: void 0,
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
export default data;
