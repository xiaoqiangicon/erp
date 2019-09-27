import envData from 'common/env_data';
var data = {
  totalPagesRecord: {},
  templeId: window.localStorage['templeId'],
  shareLink:
    'https://wx.zizaihome.com/article/articleIndex?templeId=' +
    window.localStorage['templeId'] +
    (!!envData.envParamMark ? '&' + envData.envParamMark : '') +
    '&articleId=',
  createLink: '/zzhadmin/createArticleIndex/',
  updateLink: '/zzhadmin/createArticleIndex/?action=update&id=',
  copyLink: '/zzhadmin/createArticleIndex/?action=copy&id=',
  qrcodeSizes: [300, 500, 1000],
  filter: {
    category: 0,
    status: 0,
    searchKey: '',
  },
  pagination: undefined,
};
export default data;
